using ioe_api.Infrastructure.BlobStorage;
using Microsoft.AspNetCore.Mvc;

namespace ioe_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlobTestController : ControllerBase
    {
        private readonly IBlobStorageService _blobService;

        public BlobTestController(IBlobStorageService blobService)
        {
            _blobService = blobService;
        }

        // GET: /api/blobtest/blobs?container=fs-dtc&prefix=landing/
        [HttpGet("blobs")]
        public async Task<IActionResult> GetBlobs([FromQuery] string container, [FromQuery] string prefix)
        {
            var blobs = await _blobService.GetBlobsAsync(container, prefix);
            return Ok(blobs.Select(b => new
            {
                Name = b.Name,
                Size = b.Properties.ContentLength,
                LastModified = b.Properties.LastModified
            }));
        }

        // GET: /api/blobtest/blob-exists?container=fs-dtc&blobName=landing/file.csv
        [HttpGet("blob-exists")]
        public async Task<IActionResult> BlobExists([FromQuery] string container, [FromQuery] string blobName)
        {
            var exists = await _blobService.BlobExistsAsync(container, blobName);
            return Ok(new { Exists = exists });
        }
    }
}
