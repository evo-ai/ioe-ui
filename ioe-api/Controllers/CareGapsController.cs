using ioe_api.Models.DTOs;
using ioe_api.Services.CareGaps;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/care-gaps")]
public class CareGapsController : ControllerBase
{
    private readonly ICareGapService _careGapService;
    private readonly ILogger<CareGapsController> _logger;

    public CareGapsController(ICareGapService careGapService, ILogger<CareGapsController> logger)
    {
        _careGapService = careGapService;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/care-gaps
    /// Fetches a master list of all active care gaps from the database.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CareGapDto>>> GetActiveCareGaps()
    {
        _logger.LogInformation("Attempting to fetch active care gaps from the database.");
        try
        {
            var careGaps = await _careGapService.GetActiveCareGapsAsync();


            if (careGaps.Count() == 0)
            {
                _logger.LogWarning("The query for active care gaps returned 0 records. Check if the 'engage360.care_gaps' table is populated and if any records have 'is_active = 1'.");
            }

            return Ok(careGaps);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while communicating with the database.");
            return StatusCode(500, "An error occurred while communicating with the database.");
        }
    }
}