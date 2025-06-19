import React, { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  Box,
  Button,
  Typography,
  Paper,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';

interface CareGapsProps {
  onPrevious: () => void;
  onNext: () => void;
}

const careGapCategories = [
  {
    label: 'Preventive Care Screenings',
    options: [
      'Annual Wellness Visit',
      'Diabetes Eye Care Exams',
      'Hearing',
      'Dental',
    ],
  },
  {
    label: 'Cancer Screenings',
    options: [
      'Colorectal',
      'Breast',
    ],
  },
  {
    label: 'Vaccinations',
    options: [
      'Flu',
      'Pneumococcal',
      'Covid',
    ],
  },
  {
    label: 'Care and Disease Management',
    options: [
      'Follow-up ED Visits',
      'Follow-up after Hospitalizations',
      'Controlling BP',
      'Hemoglobin A1c Control',
      'All-cause Re-admissions',
    ],
  },
  {
    label: 'Fall Risk',
    options: [
      'Baseline Risk Score',
      'Fall Risk Reduction check-in calls',
    ],
  },
  {
    label: 'Additional Support',
    options: [
      'Loneliness Support Calls',
      'Medicare Re-enrollments',
      'Food Insecurity',
    ],
  },
];

const CareGaps: React.FC<CareGapsProps> = ({ onPrevious, onNext }) => {
  const [selected, setSelected] = useState<{ [category: string]: string[] }>({});

  const handleCheckboxChange = (category: string, option: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelected((prev) => {
      const prevOptions = prev[category] || [];
      if (event.target.checked) {
        return {
          ...prev,
          [category]: [...prevOptions, option],
        };
      } else {
        return {
          ...prev,
          [category]: prevOptions.filter((item) => item !== option),
        };
      }
    });
  };

  const handleNext = () => {
    // Log selections for testing
    console.log('Selected care gaps:', selected);
    onNext();
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, margin: '32px auto' }}>
      <Typography variant="h6" gutterBottom>
        Care Gap Selection
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select the care gaps you want to address in this campaign.
      </Typography>
      <Grid2 container spacing={3}>
        {careGapCategories.map((cat) => (
          <Grid2 xs={12} md={4} key={cat.label}>
            <FormControl component="fieldset" fullWidth>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{cat.label}</Typography>
              <FormGroup>
                {cat.options.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={selected[cat.label]?.includes(option) || false}
                        onChange={handleCheckboxChange(cat.label, option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid2>
        ))}
      </Grid2>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next Step
        </Button>
      </Box>
    </Paper>
  );
};

export default CareGaps; 