using Microsoft.AspNetCore.Mvc;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using CsvHelper;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;

[ApiController]
[Route("api/[controller]")]
public class AudiencesController : ControllerBase
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IConfiguration _configuration;

    public AudiencesController(IConfiguration configuration)
    {
        _configuration = configuration;
        var connectionString = _configuration.GetConnectionString("StorageAccount");
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    private string GetContainerName(string streamType)
    {
        return streamType switch
        {
            "Healthcare Partner" => "fs-partner",
            "Direct-to-Consumer (DTC)" => "fs-dtc",
            _ => throw new ArgumentException("Invalid stream type specified.", nameof(streamType))
        };
    }

    public class FileMetadata
    {
        public string FileName { get; set; }
        public long SizeInBytes { get; set; }
        public DateTimeOffset DateModified { get; set; }
    }

    /// <summary>
    /// GET /api/audiences/available-files?streamType=...
    /// </summary>
    [HttpGet("available-files")]
    public async Task<IActionResult> GetAvailableFiles([FromQuery] string streamType)
    {
        if (string.IsNullOrEmpty(streamType))
        {
            return BadRequest("A stream type is required.");
        }

        try
        {
            var containerName = GetContainerName(streamType);
            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var fileList = new List<FileMetadata>();

            await foreach (BlobItem blobItem in blobContainerClient.GetBlobsAsync(traits: BlobTraits.Metadata, prefix: "landing/"))
            {
                if (blobItem.Properties.ContentLength > 0)
                {
                    fileList.Add(new FileMetadata
                    {
                        FileName = Path.GetFileName(blobItem.Name),
                        SizeInBytes = blobItem.Properties.ContentLength ?? 0,
                        DateModified = blobItem.Properties.LastModified ?? DateTimeOffset.MinValue
                    });
                }
            }
            return Ok(fileList.OrderByDescending(f => f.DateModified));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Azure.RequestFailedException)
        {
            // This can happen if the container doesn't exist, etc.
            return Ok(new List<FileMetadata>()); // Return empty list gracefully
        }
        catch
        {
            return StatusCode(500, "An error occurred while communicating with storage.");
        }
    }

    /// <summary>
    /// GET /api/audiences/file-preview?fileName=...&streamType=...
    /// </summary>
    [HttpGet("file-preview")]
    public async Task<IActionResult> GetFilePreview([FromQuery] string fileName, [FromQuery] string streamType)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            return BadRequest("A file name is required.");
        }
        if (string.IsNullOrEmpty(streamType))
        {
            return BadRequest("A stream type is required.");
        }

        try
        {
            var containerName = GetContainerName(streamType);
            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient($"landing/{fileName}");

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
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch
        {
            return StatusCode(500, "An error occurred while communicating with storage.");
        }
    }
} 