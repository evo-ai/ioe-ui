import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Checkbox,
  FormControlLabel,
  styled,
} from '@mui/material';
import { useCampaignContext } from './contexts/CampaignContext';

// Styled components for enhanced visual design
const CategoryCard = styled(Paper)<{ hasSelections?: boolean }>(({ theme, hasSelections }) => ({
  borderRadius: 8,
  borderLeft: `4px solid`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transform: 'translateY(-1px)',
  },
  ...(hasSelections && {
    borderLeftWidth: 6,
    background: 'linear-gradient(135deg, rgba(74, 36, 109, 0.02) 0%, rgba(229, 53, 138, 0.02) 100%)',
  }),
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  padding: '1.25rem',
  borderBottom: '1px solid #eee',
}));

const CategoryTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.75rem',
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#333',
}));

const CategoryBadge = styled(Box)(({ theme }) => ({
  background: '#4a246d',
  color: 'white',
  padding: '0.25rem 0.75rem',
  borderRadius: 12,
  fontSize: '0.75rem',
  fontWeight: 500,
}));

const CategoryControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
}));

const SelectAllButton = styled(Button)<{ outlined?: boolean }>(({ theme, outlined }) => ({
  background: outlined ? 'white' : '#e5358a',
  color: outlined ? '#e5358a' : 'white',
  border: outlined ? '1px solid #e5358a' : 'none',
  padding: '0.5rem 1rem',
  borderRadius: 4,
  fontSize: '0.875rem',
  textTransform: 'none',
  '&:hover': {
    background: outlined ? '#fdf2f8' : '#d02b7a',
  },
}));

const SelectedChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.75rem',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: '#f0f9ff',
  color: '#0369a1',
  border: '1px solid #bae6fd',
  fontSize: '0.75rem',
  '& .MuiChip-deleteIcon': {
    color: '#0369a1',
    fontSize: '0.875rem',
  },
}));

const CategoryOptions = styled(Box)(({ theme }) => ({
  padding: '1.25rem',
}));

const OptionsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '0.75rem',
}));

const OptionItem = styled(Box)<{ selected?: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.5rem',
  borderRadius: 4,
  transition: 'background 0.2s',
  cursor: 'pointer',
  background: selected ? '#e7f3ff' : 'transparent',
  '&:hover': {
    background: '#f8f9fa',
  },
}));

const OptionCheckbox = styled(Box)<{ checked?: boolean }>(({ theme, checked }) => ({
  width: 18,
  height: 18,
  border: `2px solid ${checked ? '#4a246d' : '#ddd'}`,
  borderRadius: 3,
  position: 'relative',
  transition: 'all 0.2s',
  background: checked ? '#4a246d' : 'transparent',
  ...(checked && {
    '&::after': {
      content: '"✓"',
      color: 'white',
      position: 'absolute',
      top: -2,
      left: 2,
      fontSize: 12,
      fontWeight: 'bold',
    },
  }),
}));

const OptionLabel = styled(Typography)<{ selected?: boolean }>(({ theme, selected }) => ({
  fontSize: '0.875rem',
  fontWeight: selected ? 500 : 400,
}));

const SelectionSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1.5rem',
  padding: '1rem',
  background: 'white',
  borderRadius: 8,
  borderLeft: '4px solid #e5358a',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const SummaryBadge = styled(Box)(({ theme }) => ({
  background: '#e5358a',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: 20,
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const ClearButton = styled(Button)(({ theme }) => ({
  background: 'none',
  border: '1px solid #ddd',
  color: '#666',
  padding: '0.5rem 1rem',
  borderRadius: 4,
  fontSize: '0.875rem',
  textTransform: 'none',
  '&:hover': {
    background: '#f5f5f5',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const CampaignSummary = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4a246d 0%, #e5358a 100%)',
  color: 'white',
  padding: '2rem',
  borderRadius: 8,
  marginTop: '1.5rem',
  textAlign: 'center',
}));

const careGapCategories = [
  {
    id: 'preventive',
    label: 'Preventive Care Screenings',
    color: '#2e7d32',
    options: ['Annual Wellness Visit', 'Diabetes Eye Care Exams', 'Hearing', 'Dental'],
  },
  {
    id: 'cancer',
    label: 'Cancer Screenings',
    color: '#ed6c02',
    options: ['Colorectal', 'Breast'],
  },
  {
    id: 'vaccinations',
    label: 'Vaccinations',
    color: '#1976d2',
    options: ['Flu', 'Pneumococcal', 'Covid'],
  },
  {
    id: 'disease-mgmt',
    label: 'Care and Disease Management',
    color: '#7b1fa2',
    options: ['Follow-up ED Visits', 'Follow-up after Hospitalizations', 'Controlling BP', 'Hemoglobin A1c Control', 'All-cause Re-admissions'],
  },
  {
    id: 'fall-risk',
    label: 'Fall Risk',
    color: '#c62828',
    options: ['Baseline Risk Score', 'Fall Risk Reduction check-in calls'],
  },
  {
    id: 'additional',
    label: 'Additional Support',
    color: '#795548',
    options: ['Loneliness Support Calls', 'Medicare Re-enrollments', 'Food Insecurity'],
  },
];

const CareGaps: React.FC = () => {
  const { state, dispatch } = useCampaignContext();
  const { careGaps: selected } = state;

  const updateCareGaps = (newCareGaps: typeof selected) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field: 'careGaps', value: newCareGaps } });
  };

  const handleOptionToggle = (categoryLabel: string, option: string) => {
    const newSelected = { ...selected };
    const categoryOptions = newSelected[categoryLabel] || [];

    const index = categoryOptions.indexOf(option);
    if (index > -1) {
      categoryOptions.splice(index, 1);
      if (categoryOptions.length === 0) {
        delete newSelected[categoryLabel];
      } else {
        newSelected[categoryLabel] = categoryOptions;
      }
    } else {
      newSelected[categoryLabel] = [...categoryOptions, option];
    }

    updateCareGaps(newSelected);
  };

  const handleSelectAll = (categoryLabel: string, options: string[]) => {
    const newSelected = { ...selected };
    const currentSelections = newSelected[categoryLabel] || [];

    if (currentSelections.length === options.length) {
      delete newSelected[categoryLabel];
    } else {
      newSelected[categoryLabel] = [...options];
    }

    updateCareGaps(newSelected);
  };

  const handleClearAll = () => {
    updateCareGaps({});
  };

  const getTotalSelectedCount = () => {
    return Object.values(selected).reduce((total, categorySelections) => 
      total + categorySelections.length, 0
    );
  };

  const totalSelected = getTotalSelectedCount();
  const totalCategories = Object.keys(selected).length;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#4a246d' }}>
        Configure Care Gap Interventions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Select the care gaps you want to address in this campaign. Each category can be expanded to view all available options.
      </Typography>

      <SelectionSummary>
        <SummaryBadge>
          {totalSelected} intervention{totalSelected !== 1 ? 's' : ''} selected
        </SummaryBadge>
        <ClearButton 
          variant="outlined" 
          onClick={handleClearAll}
          disabled={totalSelected === 0}
        >
          Clear All
        </ClearButton>
      </SelectionSummary>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
        {careGapCategories.map((category) => {
          const selectedInCategory = selected[category.label] || [];
          const hasSelections = selectedInCategory.length > 0;
          const allSelected = selectedInCategory.length === category.options.length;

          return (
            <CategoryCard 
              key={category.id}
              hasSelections={hasSelections}
              sx={{ borderLeftColor: category.color }}
            >
              <CategoryHeader>
                <CategoryTitleRow>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CategoryTitle>{category.label}</CategoryTitle>
                    {hasSelections && (
                      <CategoryBadge>
                        {selectedInCategory.length}/{category.options.length}
                      </CategoryBadge>
                    )}
                  </Box>
                  <CategoryControls>
                    <SelectAllButton
                      outlined={!allSelected}
                      onClick={() => handleSelectAll(category.label, category.options)}
                      size="small"
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </SelectAllButton>
                  </CategoryControls>
                </CategoryTitleRow>
                
                {hasSelections && (
                  <SelectedChips>
                    {selectedInCategory.map((option) => (
                      <StyledChip
                        key={option}
                        label={option}
                        onDelete={() => handleOptionToggle(category.label, option)}
                        size="small"
                      />
                    ))}
                  </SelectedChips>
                )}
              </CategoryHeader>

              <CategoryOptions>
                <OptionsGrid>
                  {category.options.map((option) => {
                    const isSelected = selectedInCategory.includes(option);
                    return (
                      <OptionItem
                        key={option}
                        selected={isSelected}
                        onClick={() => handleOptionToggle(category.label, option)}
                      >
                        <OptionCheckbox checked={isSelected} />
                        <OptionLabel selected={isSelected}>
                          {option}
                        </OptionLabel>
                      </OptionItem>
                    );
                  })}
                </OptionsGrid>
              </CategoryOptions>
            </CategoryCard>
          );
        })}
      </Box>

      {totalSelected > 0 && (
        <CampaignSummary>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Campaign Summary
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            You've configured {totalSelected} care gap intervention{totalSelected !== 1 ? 's' : ''} across {totalCategories} categor{totalCategories !== 1 ? 'ies' : 'y'}.
          </Typography>
        </CampaignSummary>
      )}
    </Box>
  );
};

export default CareGaps;