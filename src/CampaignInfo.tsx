import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import AudienceSelector from './AudienceSelector';
import { useCampaignContext } from './contexts/CampaignContext';

interface CampaignInfoProps {
  onNext?: () => void;
}

const CampaignInfo: React.FC<CampaignInfoProps> = ({ onNext }) => {
  const { state, dispatch } = useCampaignContext();
  const { careFlowStream, partnerName, campaignName, description, selectedAudienceFile } = state;

  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const handleFieldChange = (field: keyof typeof state, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  };
  
  const handleStreamChange = (event: SelectChangeEvent<string>) => {
    const newStream = event.target.value as string;
    handleFieldChange('careFlowStream', newStream);
    setStreamError(false);
    handleFieldChange('selectedAudienceFile', null);
    handleFieldChange('careGaps', {});
    handleFieldChange('availableCareGapFlags', []);
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
            <MenuItem value="HealthcarePartner">Healthcare Partner</MenuItem>
            <MenuItem value="DTC">Direct-to-Consumer (DTC)</MenuItem>
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
          onChange={(e) => {
            handleFieldChange('campaignName', e.target.value);
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
          onChange={(e) => {
            handleFieldChange('description', e.target.value);
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
        <AudienceSelector />
      </Box>
    </Paper>
  );
};

export default CampaignInfo;