import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import AudienceSelector from './AudienceSelector';

interface CampaignInfoProps {
  onNext?: () => void;
}

const CampaignInfo: React.FC<CampaignInfoProps> = ({ onNext }) => {
  const [careFlowStream, setCareFlowStream] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedAudienceFile, setSelectedAudienceFile] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const handleStreamChange = (event: SelectChangeEvent<string>) => {
    const newStream = event.target.value as string;
    setCareFlowStream(newStream);
    setStreamError(false);
    // Reset file selection if stream changes, as the available files will be different
    setSelectedAudienceFile(null);
    setPartnerName(null);
  };
  
  const handleSubmit = () => {
    let hasError = false;

    // Validate Care-flow Stream
    if (!careFlowStream) {
      setStreamError(true);
      hasError = true;
    } else {
      setStreamError(false);
    }
    
    // Validate Campaign Name
    if (!campaignName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }
  
    // Validate Description (if provided, ensure it's not just whitespace)
    if (description.length > 0 && description.trim().length === 0) {
      setDescError(true);
      hasError = true;
    } else {
      setDescError(false);
    }

    // Validate Audience File
    if (!selectedAudienceFile) {
      alert('Please select an audience file.');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
  
    // Log form data (for testing)
    console.log('Form submitted:', { careFlowStream, campaignName, description, file: selectedAudienceFile, partnerName });
    if (onNext) onNext();
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 900, margin: '32px auto' }}>
      <Typography variant="h5" gutterBottom>
        Step 1: Campaign Information
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Campaign Identification
      </Typography>
      
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pl: 2, pr: 2 }}>
        <FormControl fullWidth required error={streamError}>
          <InputLabel id="care-flow-stream-label">Care-flow Stream</InputLabel>
          <Select
            labelId="care-flow-stream-label"
            id="care-flow-stream-select"
            value={careFlowStream}
            label="Care-flow Stream"
            onChange={handleStreamChange}
          >
            <MenuItem value="">
              <em>-- Please choose a stream --</em>
            </MenuItem>
            <MenuItem value="Healthcare Partner">Healthcare Partner</MenuItem>
            <MenuItem value="Direct-to-Consumer (DTC)">Direct-to-Consumer (DTC)</MenuItem>
          </Select>
          {streamError && <FormHelperText>Care-flow Stream is required</FormHelperText>}
        </FormControl>

        <TextField
          label="Partner Name"
          value={partnerName || ''}
          fullWidth
          disabled
        />
        
        <TextField
          required
          label="Campaign Name"
          placeholder="e.g., Flu & Dental Checkup Campaign"
          value={campaignName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCampaignName(e.target.value);
            setNameError(false);
          }}
          error={nameError}
          helperText={nameError ? 'Campaign Name is required' : ''}
          fullWidth
        />

        <TextField
          label="Description"
          placeholder="Briefly describe the purpose and goals of this campaign..."
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDescription(e.target.value);
            setDescError(false);
          }}
          multiline
          minRows={3}
          error={descError}
          helperText={descError ? 'Description cannot be empty if provided' : ''}
          fullWidth
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Target Audience
      </Typography>

      <Box sx={{ pl: 2, pr: 2 }}>
        <AudienceSelector 
          onFileSelect={setSelectedAudienceFile} 
          onPartnerNameFound={setPartnerName}
          careFlowStream={careFlowStream}
          key={careFlowStream}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Next Step
        </Button>
      </Box>
    </Paper>
  );
};

export default CampaignInfo;