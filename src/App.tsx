import { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, ThemeProvider, Box, Button, Paper } from '@mui/material';
import CampaignInfo from './CampaignInfo';
import CareGaps from './CareGaps';
import React from 'react';
import theme from './theme';
import { CampaignProvider, useCampaignContext } from './contexts/CampaignContext';

const AppContent: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { state, dispatch } = useCampaignContext();

  // On initial app load, fetch the master list of all care gaps
  useEffect(() => {
    const fetchMasterCareGaps = async () => {
      try {
        console.log('Attempting to fetch master care gap list from /api/care-gaps...');
        const response = await fetch('/api/care-gaps');
        console.log('Response received from /api/care-gaps:', response);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch master care gap list. Status: ${response.status}. Body: ${errorText}`);
          throw new Error(`Failed to fetch master care gap list from the server. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully fetched and parsed master care gap list:', data);
        dispatch({ type: 'UPDATE_FIELD', payload: { field: 'masterCareGapList', value: data } });
      } catch (error) {
        console.error("Error fetching master care gaps:", error);
        // Optionally, dispatch an action to show an error banner
      }
    };

    fetchMasterCareGaps();
  }, [dispatch]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validation for Step 1 before proceeding
      const { careFlowStream, campaignName, selectedAudienceFile } = state;
      if (!careFlowStream || !campaignName.trim() || !selectedAudienceFile) {
        alert('Please complete all fields in Step 1 before proceeding.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  
  const handleSaveAsDraft = () => {
    const { careFlowStream, campaignName, selectedAudienceFile } = state;
    if (!careFlowStream || !campaignName.trim() || !selectedAudienceFile) {
      alert('To save a draft, please complete all fields in Step 1: Care-flow Stream, Campaign Name, and select a Target Audience file.');
      return;
    }
    console.log('Draft Saved:', state);
    alert('Campaign draft has been saved to the console!');
  };
  
  const steps = ['Campaign Info', 'Care Gaps', 'Review'];

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginTop: 24, marginBottom: 24 }}>Create New Campaign</h2>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 4, mb: 4 }}>
        {activeStep === 0 && <CampaignInfo />}
        {activeStep === 1 && <CareGaps />}
        {/* Add more steps as needed */}
      </Box>

      <Paper sx={{ position: 'sticky', bottom: 0, p: 2, borderTop: '1px solid #e0e0e0' }} elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleSaveAsDraft}>
            Save as Draft
          </Button>
          <Box>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 2 }}>
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CampaignProvider>
        <AppContent />
      </CampaignProvider>
    </ThemeProvider>
  );
}

export default App;