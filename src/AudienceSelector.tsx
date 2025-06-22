import React, { useState, useEffect, useCallback } from 'react';
import { 
  Select, MenuItem, FormControl, InputLabel, CircularProgress, Box, 
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, SelectChangeEvent, Skeleton, TablePagination 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useCampaignContext } from './contexts/CampaignContext';

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

const AudienceSelector: React.FC = () => {
  const { state, dispatch } = useCampaignContext();
  const { careFlowStream, selectedAudienceFile } = state;

  const [fileList, setFileList] = useState<FileMetadata[]>([]);
  const [previewData, setPreviewData] = useState<DataRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchAndProcessFile = useCallback(async (fileName: string | null) => {
    if (!careFlowStream || !fileName) {
      setPreviewData([]);
      setValidationSummary(null);
      dispatch({ type: 'UPDATE_FIELD', payload: { field: 'partnerName', value: null } });
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationSummary(null);
    setPage(0);

    try {
      const response = await fetch(`/api/audiences/file-preview?fileName=${encodeURIComponent(fileName)}&streamType=${encodeURIComponent(careFlowStream)}`);
      if (!response.ok) {
        throw new Error(await response.text() || `Failed to fetch preview for ${fileName}.`);
      }
      const data: DataRecord[] = await response.json();
      setPreviewData(data);

      if (data.length > 0) {
        dispatch({ type: 'UPDATE_FIELD', payload: { field: 'partnerName', value: data[0].partner_name || null } });
        const headers = Object.keys(data[0]);
        setValidationSummary({
          membersFound: data.length,
          hasMandatoryHeaders: headers.some(header => header.startsWith('salesforce_account_number')),
        });
      }
    } catch (err: any) {
      setError(err.message);
      setPreviewData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [careFlowStream, dispatch]);

  useEffect(() => {
    const fetchFileList = async () => {
      if (!careFlowStream) {
        setFileList([]);
        return;
      }
      try {
        const response = await fetch(`/api/audiences/available-files?streamType=${encodeURIComponent(careFlowStream)}`);
        if (!response.ok) throw new Error('Failed to fetch file list from server.');
        setFileList(await response.json());
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchFileList();
  }, [careFlowStream]);

  useEffect(() => {
    if (selectedAudienceFile) {
      fetchAndProcessFile(selectedAudienceFile);
    } else {
      setPreviewData([]);
      setValidationSummary(null);
    }
  }, [selectedAudienceFile, fetchAndProcessFile]);
  
  const handleFileSelectChange = (event: SelectChangeEvent<string>) => {
    const fileName = event.target.value as string;
    dispatch({ type: 'UPDATE_FIELD', payload: { field: 'selectedAudienceFile', value: fileName || null } });
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
              value={selectedAudienceFile || ''}
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
          <Typography variant="h6" gutterBottom>File Preview: {selectedAudienceFile}</Typography>
          <PreviewTable data={paginatedData} />
        </Box>
      )}
    </Box>
  );
};

export default AudienceSelector; 