using CsvHelper;
using ioe_api.Infrastructure.BlobStorage;
using Microsoft.Extensions.Options;
using System.Globalization;

namespace ioe_api.Services.Audience
{
    public class AudienceService : IAudienceService
    {
        private readonly IBlobStorageService _blobStorageService;

        private readonly Dictionary<string, string> _containerMap;

        private readonly Dictionary<string, string> _prefixMap;

        public AudienceService(IBlobStorageService blobStorageService, IOptions<BlobStorageOptions> blobOptions)
        {
            _blobStorageService = blobStorageService;

            _containerMap = blobOptions.Value.Containers;

            _prefixMap = blobOptions.Value.Prefixes;

        }

        public async Task<IEnumerable<FileMetadata>> GetAvailableFilesAsync(string streamType, bool sortDescendingByDate = true)
        {
            var containerName = ResolveContainerName(streamType);

            var prefix = GetLandingPrefix();

            var blobs = await _blobStorageService.GetBlobsAsync(containerName, prefix);

            var files = blobs
                .Where(b => b.Properties.ContentLength > 0)
                .Select(b => new FileMetadata
                {
                    FileName = Path.GetFileName(b.Name),
                    SizeInBytes = b.Properties.ContentLength ?? 0,
                    DateModified = b.Properties.LastModified ?? DateTimeOffset.MinValue
                });

            return sortDescendingByDate
                ? files.OrderByDescending(f => f.DateModified)
                : files.OrderBy(f => f.DateModified);
        }

        public async Task<IEnumerable<dynamic>> GetFilePreviewAsync(string streamType, string fileName)
        {
            var (stream, reader) = await ResolveBlobStreamReaderAsync(streamType, fileName);

            using (stream)
            using (reader)
            {
                using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

                return csv.GetRecords<dynamic>().ToList();
            }
        }

        public async Task<IEnumerable<string>> GetFileHeadersAsync(string streamType, string fileName)
        {
            var (stream, reader) = await ResolveBlobStreamReaderAsync(streamType, fileName);

            using (stream)
            using (reader)
            {
                var headerLine = await reader.ReadLineAsync();

                if (string.IsNullOrEmpty(headerLine))
                    return new List<string>();

                return headerLine
                    .Split(',')
                    .Select(h => h.Trim().Trim('"'))
                    .Where(h => h.EndsWith("_import_flag"))
                    .ToList();
            }
        }

        private string GetLandingPrefix()
        {
            return _prefixMap[BlobPrefixKeys.Landing];
        }

        private string ResolveContainerName(string streamType)
        {
            if (!_containerMap.TryGetValue(streamType, out var containerName))
            {
                throw new ArgumentException($"Invalid stream type: {streamType}");
            }
            return containerName;
        }

        private async Task<(Stream Stream, StreamReader Reader)> ResolveBlobStreamReaderAsync(string streamType, string fileName)
        {
            var containerName = ResolveContainerName(streamType);
            var blobPath = $"{GetLandingPrefix()}{fileName}";

            if (!await _blobStorageService.BlobExistsAsync(containerName, blobPath))
                throw new FileNotFoundException($"Blob '{blobPath}' not found in container '{containerName}'.");

            var stream = await _blobStorageService.GetBlobStreamAsync(containerName, blobPath);
            var reader = new StreamReader(stream);

            return (stream, reader);
        }

    }
}
