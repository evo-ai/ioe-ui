import React, { useState, useEffect } from 'react';
import { 
  Select, MenuItem, FormControl, InputLabel, CircularProgress, Box, 
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, SelectChangeEvent, Skeleton, TablePagination 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Using `any` is simple for dynamic data, but for production, you might define a more specific type.
type DataRecord = Record<string, any>;

interface FileMetadata {
  fileName: string;
  sizeInBytes: number;
  dateModified: string;
}

interface ValidationSummary {
  membersFound: number;
  hasMandatoryHeaders: boolean;
}

interface AudienceSelectorProps {
  onFileSelect: (fileName: string | null) => void;
  onPartnerNameFound: (partnerName: string | null) => void;
  careFlowStream: string;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ onFileSelect, onPartnerNameFound, careFlowStream }) => {
  const [fileList, setFileList] = useState<FileMetadata[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [previewData, setPreviewData] = useState<DataRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 1. Fetch the list of files from our backend API when the component first loads.
  useEffect(() => {
    const fetchFileList = async () => {
      if (!careFlowStream) {
        setFileList([]);
        onPartnerNameFound(null); // Clear partner name when stream is cleared
        return;
      }
      setError(null);
      try {
        const response = await fetch(`/api/audiences/available-files?streamType=${encodeURIComponent(careFlowStream)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch file list from server.');
        }
        const data: FileMetadata[] = await response.json();
        setFileList(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFileList();
  }, [careFlowStream, onPartnerNameFound]); // The effect now depends on careFlowStream

  // 2. Handle the user selecting a file from the dropdown.
  const handleFileSelectChange = async (event: SelectChangeEvent<string>) => {
    const fileName = event.target.value as string;
    setSelectedFile(fileName);
    onFileSelect(fileName || null); // Notify parent component
    setPreviewData([]); // Clear any previous preview
    onPartnerNameFound(null); // Reset partner name on new file selection
    setValidationSummary(null);
    setPage(0); // Reset page on new file selection

    if (!fileName) {
      return; // Stop if the user selected the "-- Please choose --" option
    }

    setIsLoading(true);
    setError(null);
    try {
      // 3. Fetch the preview content for the selected file from our backend API.
      const response = await fetch(`/api/audiences/file-preview?fileName=${encodeURIComponent(fileName)}&streamType=${encodeURIComponent(careFlowStream)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to fetch preview for ${fileName}.`);
      }
      const data: DataRecord[] = await response.json();
      setPreviewData(data);

      if (data.length > 0) {
        if (data[0].partner_name) onPartnerNameFound(data[0].partner_name);
        
        const headers = Object.keys(data[0]);
        setValidationSummary({
          membersFound: data.length,
          hasMandatoryHeaders: headers.includes('salesforce_account_number'),
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = previewData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // A sub-component to render the data table nicely with Material-UI
  const PreviewTable = ({ data }: { data: DataRecord[] }) => {
    if (data.length === 0) return null;
    const headers = Object.keys(data[0]);

    return (
      <>
        <TableContainer component={Paper} sx={{ maxHeight: 500, mt: 2 }}>
          <Table stickyHeader aria-label="preview table">
            <TableHead>
              <TableRow>
                {headers.map(header => <TableCell key={header}><b>{header}</b></TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {headers.map(header => <TableCell key={header}>{row[header]}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={previewData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Target Audience File
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Choose a pre-ingested CSV file. A validation summary and preview will appear.
          </Typography>
          <FormControl fullWidth disabled={!careFlowStream}>
            <InputLabel id="file-select-label">Available Files</InputLabel>
            <Select
              labelId="file-select-label"
              id="file-select"
              value={selectedFile}
              label="Available Files"
              onChange={handleFileSelectChange}
            >
              <MenuItem value=""><em>-- Please choose a file --</em></MenuItem>
              {fileList.map(file => (
                <MenuItem key={file.fileName} value={file.fileName}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="body2">{file.fileName}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatDate(file.dateModified)}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          {validationSummary && (
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" gutterBottom>Validation Summary</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">{validationSummary.membersFound.toLocaleString()} Members Found</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {validationSummary.hasMandatoryHeaders ? 
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} /> : 
                  <WarningIcon color="warning" sx={{ mr: 1 }} />
                }
                <Typography variant="body2">
                  {validationSummary.hasMandatoryHeaders ? 'Mandatory Headers Found' : 'Mandatory Headers Missing'}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
      
      {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
      
      {isLoading ? (
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={200} />
        </Box>
      ) : paginatedData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>File Preview: {selectedFile}</Typography>
          <PreviewTable data={paginatedData} />
        </Box>
      )}
    </Box>
  );
};

export default AudienceSelector; 