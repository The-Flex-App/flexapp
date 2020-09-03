import { createMuiTheme } from '@material-ui/core/styles';

let theme = createMuiTheme({});

theme.overrides = {
  MuiPaper: {
    root: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  },
};

export default theme;