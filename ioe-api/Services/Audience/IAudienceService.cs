namespace ioe_api.Services.Audience
{
    public interface IAudienceService
    {
        Task<IEnumerable<FileMetadata>> GetAvailableFilesAsync(string streamType, bool sortDescendingByDate = true);

        Task<IEnumerable<dynamic>> GetFilePreviewAsync(string streamType, string fileName);

        Task<IEnumerable<string>> GetFileHeadersAsync(string streamType, string fileName);
    }
}
