using ioe_api.Infrastructure.BlobStorage;
using ioe_api.Services.Audience;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AudiencesController : ControllerBase
{
    private readonly IAudienceService _audienceService;

    public AudiencesController(IAudienceService audienceService)
    {
        _audienceService = audienceService;
    }

    /// <summary>
    /// GET /api/audiences/available-files?streamType=...
    /// </summary>
    [HttpGet("available-files")]
    public async Task<IActionResult> GetAvailableFiles([FromQuery] string streamType)
    {
        if (string.IsNullOrWhiteSpace(streamType))
            return BadRequest("A stream type is required.");

        try
        {
            var files = await _audienceService.GetAvailableFilesAsync(streamType);
            return Ok(files);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (BlobStorageAccessException ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// GET /api/audiences/file-preview?fileName=...&streamType=...
    /// </summary>
    [HttpGet("file-preview")]
    public async Task<IActionResult> GetFilePreview([FromQuery] string fileName, [FromQuery] string streamType)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return BadRequest("A file name is required.");

        if (string.IsNullOrWhiteSpace(streamType))
            return BadRequest("A stream type is required.");

        try
        {
            var records = await _audienceService.GetFilePreviewAsync(streamType, fileName);
            return Ok(records);
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (BlobStorageAccessException ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// GET /api/audiences/file-headers?fileName=...&streamType=...
    /// Analyzes CSV headers to find care gap columns and returns available care gaps
    /// </summary>
    [HttpGet("file-headers")]
    public async Task<IActionResult> GetFileHeaders([FromQuery] string fileName, [FromQuery] string streamType)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return BadRequest("A file name is required.");

        if (string.IsNullOrWhiteSpace(streamType))
            return BadRequest("A stream type is required.");

        try
        {
            var headers = await _audienceService.GetFileHeadersAsync(streamType, fileName);
            return Ok(headers);
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (BlobStorageAccessException ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}