import { createMuiTheme, fade } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    fontFamily: '"Verdana", "Geneva", "Tahoma", sans-serif',
    fontSize: 15,
    body1: {
      fontSize: 15,
    },
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
      color: 'inherit',
    },
  },
  MuiDialogActions: {
    root: {
      padding: theme.spacing(2, 3),
    },
  },
  MuiIconButton: {
    root: {
      padding: theme.spacing(1),
      color: 'inherit',
    },
  },
  MuiAvatar: {
    root: {
      width: 40,
      height: 40,
      fontSize: 18,
    },
  },
  MuiSvgIcon: {
    root: {
      fontSize: 18,
    },
  },
  MuiSelect: {
    icon: {
      fontSize: 24,
    },
  },
  MuiListItem: {
    root: {
      '&$selected': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
      },
    },
  },
};

export default theme;
