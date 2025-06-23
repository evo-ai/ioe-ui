using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ioe_api.Models
{
    [Table("care_gaps", Schema = "engage360")]
    public class CareGap
    {
        [Key]
        [Column("care_gap_id")]
        public int CareGapId { get; set; }

        [Required]
        [Column("care_gap_name")]
        public string CareGapName { get; set; }

        [Required]
        [Column("care_gap_category")]
        public string CareGapCategory { get; set; }

        [Required]
        [Column("care_gap_abbreviation")]
        public string CareGapAbbreviation { get; set; }

        [Required]
        [Column("csv_import_flag_name")]
        public string CsvImportFlagName { get; set; }

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; }

        [Required]
        [Column("created_dttm")]
        public DateTime CreatedDttm { get; set; }

        [Required]
        [Column("last_modified_dttm")]
        public DateTime LastModifiedDttm { get; set; }
    }
} 