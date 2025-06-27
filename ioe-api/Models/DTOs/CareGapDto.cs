namespace ioe_api.Models.DTOs
{
    public class CareGapDto
    {
        public int CareGapId { get; set; }

        public string CareGapName { get; set; } = string.Empty;

        public string CareGapCategory { get; set; } = string.Empty;

        public string CareGapAbbreviation { get; set; } = string.Empty;

        public string CsvImportFlagName { get; set; } = string.Empty;
    }
}
