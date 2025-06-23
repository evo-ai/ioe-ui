using Microsoft.EntityFrameworkCore;
using ioe_api.Models;

namespace ioe_api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<CareGap> CareGaps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure the default schema is correct if not specified via attributes
            modelBuilder.HasDefaultSchema("engage360");
        }
    }
} 