import { Stepper, Step, StepLabel } from '@mui/material';

function App() {
  return (
    <div>
      <h1>Welcome to IOE-UI Campaign Wizard!</h1>
      <Stepper activeStep={0} alternativeLabel>
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
    </div>
  );
}

export default App;