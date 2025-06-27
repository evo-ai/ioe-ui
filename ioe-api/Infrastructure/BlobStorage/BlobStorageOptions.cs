namespace ioe_api.Infrastructure.BlobStorage
{
    public class BlobStorageOptions
    {
        public Dictionary<string, string> Containers { get; set; } = new();
        public Dictionary<string, string> Prefixes { get; set; } = new();
    }
}
