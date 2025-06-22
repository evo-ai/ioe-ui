import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a246d', // Deep Purple
    },
    secondary: {
      main: '#e5358a', // Vibrant Pink
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#e5358a', // Use secondary color for contained buttons
          color: '#ffffff', // Ensure text is white for better contrast
          '&:hover': {
            backgroundColor: '#d02b7a', // A slightly darker pink for hover
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#e5358a', // Use secondary color for the active step icon
          },
        },
      },
    },
  },
});

export default theme; 