using Azure.Storage.Blobs.Models;

namespace ioe_api.Infrastructure.BlobStorage
{
    public interface IBlobStorageService
    {
        Task<IEnumerable<BlobItem>> GetBlobsAsync(string containerName, string prefix);

        Task<Stream> GetBlobStreamAsync(string containerName, string blobName);

        Task<bool> BlobExistsAsync(string containerName, string blobName);
    }
}
