import { createMuiTheme } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    fontFamily: '"Verdana", "Geneva", "Tahoma", sans-serif',
  },
  palette: {
    text: {
      primary: '#0199ad',
    },
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
};

export default theme;
