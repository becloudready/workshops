import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#31511e',
      dark: '#1f3512',
      light: '#708b57',
    },
    secondary: {
      main: '#d9a441',
      contrastText: '#17210f',
    },
    success: {
      main: '#15803d',
    },
    warning: {
      main: '#b45309',
    },
    background: {
      default: '#f5f3ea',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#5b6475',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.25rem)',
      fontWeight: 750,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontSize: 'clamp(1.55rem, 3vw, 2.1rem)',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 42,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(23, 32, 51, 0.08)',
          boxShadow: '0 14px 40px rgba(23, 32, 51, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

export default theme;
