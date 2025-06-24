using ioe_api.Data;
using ioe_api.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ioe_api.Services.CareGaps
{
    public class CareGapService : ICareGapService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CareGapService> _logger;

        public CareGapService(ApplicationDbContext context, ILogger<CareGapService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<CareGapDto>> GetActiveCareGapsAsync()
        {
            try
            {
                var careGaps = await _context.CareGaps
                    .AsNoTracking()
                    .Where(cg => cg.IsActive)
                    .Select(cg => new CareGapDto
                    {
                        CareGapId = cg.CareGapId,
                        CareGapName = cg.CareGapName,
                        CareGapCategory = cg.CareGapCategory,
                        CareGapAbbreviation = cg.CareGapAbbreviation,
                        CsvImportFlagName = cg.CsvImportFlagName
                    })
                    .ToListAsync();

                if (!careGaps.Any())
                {
                    _logger.LogWarning("No active care gaps found.");
                }

                return careGaps;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error occurred while fetching care gaps.");
                throw;
            }
        }
    }
}
