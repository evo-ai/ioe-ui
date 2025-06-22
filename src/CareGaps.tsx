import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCampaignContext } from './contexts/CampaignContext';

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

const careGapColumns = [
  [careGapCategories[0], careGapCategories[3]], // Col 1
  [careGapCategories[1], careGapCategories[4]], // Col 2
  [careGapCategories[2], careGapCategories[5]], // Col 3
];

const CareGaps: React.FC = () => {
  const { state, dispatch } = useCampaignContext();
  const { careGaps: selected } = state;
  const allCategoryLabels = careGapCategories.map(cat => cat.label);
  const [expanded, setExpanded] = React.useState<string[]>(allCategoryLabels);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(current => isExpanded ? [...current, panel] : current.filter(p => p !== panel));
  };
  
  const updateCareGaps = (newCareGaps: typeof selected) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field: 'careGaps', value: newCareGaps } });
  };

  const handleCategoryChange = (categoryLabel: string, options: string[]) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = { ...selected };
    if (event.target.checked) {
      newSelected[categoryLabel] = options;
    } else {
      delete newSelected[categoryLabel];
    }
    updateCareGaps(newSelected);
  };
  
  const handleOptionChange = (categoryLabel: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.name;
    const newSelected = { ...selected };
    const categoryOptions = newSelected[categoryLabel] || [];

    if (event.target.checked) {
      newSelected[categoryLabel] = [...categoryOptions, option];
    } else {
      newSelected[categoryLabel] = categoryOptions.filter((item) => item !== option);
    }
    
    if (newSelected[categoryLabel].length === 0) {
      delete newSelected[categoryLabel];
    }
    updateCareGaps(newSelected);
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Care Gap Selection
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select the care gaps you want to address in this campaign.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {careGapColumns.map((column, colIndex) => (
          <Box 
            key={colIndex}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: { xs: '100%', md: 'calc(33.333% - 11px)' },
              flexGrow: 1,
            }}
          >
            {column.map((cat) => {
              const selectedInCategory = selected[cat.label] || [];
              const allSelected = selectedInCategory.length === cat.options.length;
              const someSelected = selectedInCategory.length > 0 && !allSelected;
              
              return (
                <Accordion 
                  key={cat.label} 
                  expanded={expanded.includes(cat.label)}
                  onChange={handleAccordionChange(cat.label)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      label={<b>{cat.label}</b>}
                      control={
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected}
                          onChange={handleCategoryChange(cat.label, cat.options)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                      <FormGroup>
                        {cat.options.map((option) => (
                          <FormControlLabel
                            key={option}
                            label={option}
                            control={
                              <Checkbox
                                checked={selectedInCategory.includes(option)}
                                onChange={handleOptionChange(cat.label)}
                                name={option}
                              />
                            }
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CareGaps;