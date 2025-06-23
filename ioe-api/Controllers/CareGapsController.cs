using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ioe_api.Data;
using ioe_api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/care-gaps")]
public class CareGapsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CareGapsController> _logger;

    public CareGapsController(ApplicationDbContext context, ILogger<CareGapsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/care-gaps
    /// Fetches a master list of all active care gaps from the database.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetActiveCareGaps()
    {
        _logger.LogInformation("Attempting to fetch active care gaps from the database.");
        try
        {
            var careGaps = await _context.CareGaps
                .AsNoTracking()
                .Where(cg => cg.IsActive)
                .Select(cg => new 
                {
                    cg.CareGapId,
                    cg.CareGapName,
                    cg.CareGapCategory,
                    cg.CareGapAbbreviation,
                    cg.CsvImportFlagName
                })
                .ToListAsync();

            _logger.LogInformation($"Successfully fetched {careGaps.Count} active care gaps from the database.");

            if (careGaps.Count == 0)
            {
                _logger.LogWarning("The query for active care gaps returned 0 records. Check if the 'engage360.care_gaps' table is populated and if any records have 'is_active = 1'.");
            }

            return Ok(careGaps);
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "An error occurred while communicating with the database.");
            return StatusCode(500, "An error occurred while communicating with the database.");
        }
    }
} 