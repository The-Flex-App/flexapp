import { createMuiTheme } from '@material-ui/core/styles';

let theme = createMuiTheme({});

theme.overrides = {
  MuiPaper: {
    rounded: {
      borderRadius: '0px',
    },
  },

  MuiButton: {
    containedPrimary: {
      textTransform: 'none',
      color: 'white',
      backgroundColor: '#606060',
    },
  },
  MuiIconButton: {
    sizeSmall: {
      fontSize: '12px',
      color: '#696969',
      disableFocusRipple: true,
      '&:hover': {
        color: 'black',
      },
    },
    colorSecondary: {
      color: 'white',
    },
  },
  MuiPopover: {
    root: {
      marginTop: '30px',
      marginRight: '12px',
    },
  },
  MuiCardMedia: {
    img: {
      width: '20px',
    },
    root: {
      backgroundSize: 'unset',
    },
  },
  MuiCard: {
    root: {
      padding: '6px',
      backgroundColor: 'whitesmoke',
      margin: '4px',
      borderRadius: '2px',
    },
  },
  MuiDivider: {
    root: {
      marginTop: '7px',
    },
  },
  MuiCardActions: {
    root: {
      padding: '2px',
    },
  },
  MuiTypography: {
    colorPrimary: {
      color: 'white',
    },
    h6: {
      fontSize: '18px',
      fontWeight: '590',
      fontFamily: 'unset',
    },
    body2: {
      fontSize: '12px',
      fontFamily: 'unset',
    },
    caption: {
      fontSize: '11px',
      fontStyle: 'italic',
      fontFamily: 'unset',
    },
  },
  MuiCircularProgress: {
    colorPrimary: {
      position: 'absolute',
      top: '40%',
      marginLeft: '50%',
    },
  },
};

export default theme;
