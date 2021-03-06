import { createMuiTheme, fade } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    fontFamily: '"Verdana", "Geneva", "Tahoma", sans-serif',
    fontSize: 14,
    body1: {
      fontSize: 14,
    },
  },
  palette: {
    primary: {
      main: '#0199ad',
      light: '#6cc9d6',
    },
  },
});

theme.overrides = {
  MuiToolbar: {
    root: {
      minHeight: '38px !important',
    },
  },
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
  MuiAccordion: {
    root: {
      minHeight: 0,
      maxHeight: 28,
      padding: 0,
      background: 'transparent',
      boxShadow: 'none',
      '&$expanded': {
        margin: 0,
      },
    },
    expanded: {
      margin: 0,
      minHeight: 0,
    },
  },
  MuiAccordionSummary: {
    root: {
      minHeight: 0,
      maxHeight: 28,
      padding: '0 4px 0 0',
      '&$expanded': { minHeight: 0, margin: 0 },
      '&hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    content: {
      margin: 0,
      '&$expanded': { minHeight: 0 },
    },
  },
};

export default theme;
