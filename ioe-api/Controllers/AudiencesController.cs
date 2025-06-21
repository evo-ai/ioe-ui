using Microsoft.AspNetCore.Mvc;
using Azure.Storage.Blobs;
using CsvHelper;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class AudiencesController : ControllerBase
{
    private readonly BlobContainerClient _blobContainerClient;

    public AudiencesController(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("StorageAccount");
        _blobContainerClient = new BlobContainerClient(connectionString, "fs-partner");
    }

    /// <summary>
    /// GET /api/audiences/available-files
    /// </summary>
    [HttpGet("available-files")]
    public async Task<IActionResult> GetAvailableFiles()
    {
        var fileNames = new List<string>();
        var blobHierarchy = _blobContainerClient.GetBlobsByHierarchyAsync(prefix: "landing/");

        await foreach (var blobItem in blobHierarchy)
        {
            if (blobItem.IsBlob)
            {
                var fileName = Path.GetFileName(blobItem.Blob.Name);
                if (!string.IsNullOrEmpty(fileName))
                {
                    fileNames.Add(fileName);
                }
            }
        }
        return Ok(fileNames);
    }

    /// <summary>
    /// GET /api/audiences/file-preview?fileName=...
    /// </summary>
    [HttpGet("file-preview")]
    public async Task<IActionResult> GetFilePreview([FromQuery] string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            return BadRequest("A file name is required.");
        }

        var blobClient = _blobContainerClient.GetBlobClient($"landing/{fileName}");

        if (!await blobClient.ExistsAsync())
        {
            return NotFound($"The specified file '{fileName}' was not found.");
        }

        using var stream = new MemoryStream();
        await blobClient.DownloadToAsync(stream);
        stream.Position = 0;

        using var reader = new StreamReader(stream);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        var records = csv.GetRecords<dynamic>().ToList();

        return Ok(records);
    }
} 