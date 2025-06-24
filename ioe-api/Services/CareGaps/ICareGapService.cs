using ioe_api.Models.DTOs;

namespace ioe_api.Services.CareGaps
{
    public interface ICareGapService
    {
        Task<IEnumerable<CareGapDto>> GetActiveCareGapsAsync();
    }
}
