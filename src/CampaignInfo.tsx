import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import AudienceSelector from './AudienceSelector';

interface CampaignInfoProps {
  onNext?: () => void;
}

const CampaignInfo: React.FC<CampaignInfoProps> = ({ onNext }) => {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAudienceFile, setSelectedAudienceFile] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);

  const handleSubmit = () => {
    // Validate Campaign Name
    if (!campaignName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
  
    // Validate Description (if provided, ensure it's not just whitespace)
    if (description.length > 0 && description.trim().length === 0) {
      setDescError(true);
      return;
    }
    setDescError(false);

    // Validate Audience File
    if (!selectedAudienceFile) {
      alert('Please select an audience file.');
      return;
    }
  
    // Log form data (for testing)
    console.log('Form submitted:', { campaignName, description, file: selectedAudienceFile });
    if (onNext) onNext();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: '32px auto' }}>
      <Typography variant="h6" gutterBottom>
        Campaign Identification
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter basic information about your campaign and upload your target audience.
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            setDescError(false); // Clear error when user types
          }}
          multiline
          minRows={3}
          error={descError}
          helperText={descError ? 'Description cannot be empty if provided' : ''}
          fullWidth
        />
        <AudienceSelector onFileSelect={setSelectedAudienceFile} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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