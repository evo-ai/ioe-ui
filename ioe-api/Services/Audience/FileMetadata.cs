namespace ioe_api.Services.Audience
{
    public class FileMetadata
    {
        public string FileName { get; set; } = string.Empty;

        public long SizeInBytes { get; set; }

        public DateTimeOffset DateModified { get; set; }
    }
}
