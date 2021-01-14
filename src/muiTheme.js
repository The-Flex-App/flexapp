import { createMuiTheme } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    fontFamily: '"Verdana", "Geneva", "Tahoma", sans-serif',
    fontSize: 13.333,
  },
  palette: {
    primary: {
      main: '#0199ad',
    },
  },
});

theme.overrides = {
  MuiPaper: {
    root: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  },
  MuiIconButton: {
    root: {
      padding: theme.spacing(1),
    },
  },
};

export default theme;
