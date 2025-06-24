using Azure.Storage.Blobs;
using ioe_api.Data;
using ioe_api.Infrastructure.BlobStorage;
using ioe_api.Services.Audience;
using ioe_api.Services.CareGaps;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<BlobStorageOptions>(
    builder.Configuration.GetSection("BlobStorage"));

builder.Services.AddSingleton(x =>
    new BlobServiceClient(builder.Configuration.GetConnectionString("StorageAccount")));

builder.Services.AddScoped<IBlobStorageService, BlobStorageService>();

builder.Services.AddScoped<IAudienceService, AudienceService>();

builder.Services.AddScoped<ICareGapService, CareGapService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
