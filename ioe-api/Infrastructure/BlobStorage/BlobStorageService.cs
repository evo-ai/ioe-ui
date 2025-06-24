using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace ioe_api.Infrastructure.BlobStorage
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;

        public BlobStorageService(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        public async Task<IEnumerable<BlobItem>> GetBlobsAsync(string containerName, string prefix)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var results = new List<BlobItem>();

                await foreach (var blob in containerClient.GetBlobsAsync(BlobTraits.Metadata, prefix: prefix))
                {
                    results.Add(blob);
                }

                return results;
            }
            catch (RequestFailedException ex) when (ex.ErrorCode == "ContainerNotFound")
            {
                // Graceful degradation: container doesn't exist
                return Enumerable.Empty<BlobItem>();
            }
            catch (RequestFailedException ex)
            {
                // You could log and rethrow as a domain-specific exception
                throw new BlobStorageAccessException("Error accessing blob storage", ex);
            }
        }

        public async Task<Stream> GetBlobStreamAsync(string containerName, string blobName)
        {
            try
            {
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var blobClient = blobContainerClient.GetBlobClient(blobName);

                var stream = new MemoryStream();
                await blobClient.DownloadToAsync(stream);
                stream.Position = 0;
                return stream;
            }
            catch (RequestFailedException ex)
            {
                throw new BlobStorageAccessException("Failed to download blob content.", ex);
            }
        }

        public async Task<bool> BlobExistsAsync(string containerName, string blobName)
        {
            try
            {
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var blobClient = blobContainerClient.GetBlobClient(blobName);
                return await blobClient.ExistsAsync();
            }
            catch (RequestFailedException ex)
            {
                throw new BlobStorageAccessException($"Error checking existence of blob '{blobName}' in container '{containerName}'.", ex);
            }
        }
    }
}
