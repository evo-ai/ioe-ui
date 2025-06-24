namespace ioe_api.Infrastructure.BlobStorage
{
    public class BlobStorageAccessException : Exception
    {
        public BlobStorageAccessException(string message, Exception inner) : base(message, inner) { }

        public string? ErrorCode => (InnerException as Azure.RequestFailedException)?.ErrorCode;
    }
}
