import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SelectChangeEvent } from '@mui/material';

// Using `any` is simple for dynamic data, but for production, you might define a more specific type.
type DataRecord = any;

interface AudienceSelectorProps {
  onFileSelect: (fileName: string | null) => void;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ onFileSelect }) => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [previewData, setPreviewData] = useState<DataRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch the list of files from our backend API when the component first loads.
  useEffect(() => {
    const fetchFileList = async () => {
      setError(null);
      try {
        const response = await fetch('/api/audiences/available-files');
        if (!response.ok) {
          throw new Error('Failed to fetch file list from server.');
        }
        const data: string[] = await response.json();
        setFileList(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFileList();
  }, []); // The empty array [] means this effect runs only once.

  // 2. Handle the user selecting a file from the dropdown.
  const handleFileSelectChange = async (event: SelectChangeEvent<string>) => {
    const fileName = event.target.value as string;
    setSelectedFile(fileName);
    onFileSelect(fileName || null); // Notify parent component
    setPreviewData([]); // Clear any previous preview

    if (!fileName) {
      return; // Stop if the user selected the "-- Please choose --" option
    }

    setIsLoading(true);
    setError(null);
    try {
      // 3. Fetch the preview content for the selected file from our backend API.
      const response = await fetch(`/api/audiences/file-preview?fileName=${encodeURIComponent(fileName)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to fetch preview for ${fileName}.`);
      }
      const data: DataRecord[] = await response.json();
      setPreviewData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // A sub-component to render the data table nicely with Material-UI
  const PreviewTable = ({ data }: { data: DataRecord[] }) => {
    if (data.length === 0) return null;
    const headers = Object.keys(data[0]);

    return (
      <TableContainer component={Paper} sx={{ maxHeight: 440, mt: 2 }}>
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
    );
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Target Audience (Select From Landing Zone)
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Choose a pre-ingested CSV file from the secure landing zone. The file contents will be shown below.
      </Typography>

      <FormControl fullWidth>
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
            <MenuItem key={file} value={file}>{file}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
      
      {previewData.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>File Preview: {selectedFile}</Typography>
          <PreviewTable data={previewData} />
        </Box>
      )}
    </Box>
  );
};

export default AudienceSelector; 