import { useState } from 'react';
import { Stepper, Step, StepLabel, ThemeProvider } from '@mui/material';
import CampaignInfo from './CampaignInfo';
import CareGaps from './CareGaps';
import React from 'react';
import theme from './theme';


function App() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2 style={{ fontWeight: 700, marginTop: 24, marginBottom: 24 }}>Create New Campaign</h2>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>Campaign Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Care Gaps</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && <CampaignInfo onNext={handleNext} />}
        {activeStep === 1 && <CareGaps onPrevious={handleBack} onNext={handleNext} />}
        {/* Add more steps as needed */}
      </div>
    </ThemeProvider>
  );
}

export default App;