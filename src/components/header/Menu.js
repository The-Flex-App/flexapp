import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuMenu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  menuTitle: {
    padding: '2px 16px 10px',
    fontWeight: 'bold',
    pointerEvents: 'none',
  },
  menuPaper: {
    padding: 0,
    marginTop: 15,
    width: 300,
    overflow: 'visible',
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
  },
  menuListRoot: {
    position: 'relative',
    '&::before': {
      content: '" "',
      opacity: 1,
      width: 14,
      height: 14,
      position: 'absolute',
      background: 'white',
      top: -7,
      right: 12,
      zIndex: -1,
      transform: 'rotate(45deg)',
      boxShadow: '-2px -2px 4px rgba(0,0,0,.2)',
      transition: '300ms',
    },
  },
}));

export default function Menu(props) {
  const { menuItems, menuItemsTitle, id, trigger, ...restProps } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      {React.cloneElement(trigger, { onClick: handleMenu })}
      {menuItems.length > 0 && (
        <MuMenu
          {...restProps}
          id={id}
          classes={{ paper: classes.menuPaper, list: classes.menuListRoot }}
          anchorEl={anchorEl}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          {[
            menuItemsTitle ? (
              <Typography
                key={'menu-list-title'}
                component={'div'}
                className={classes.menuTitle}
                tabIndex={-1}
              >
                {menuItemsTitle}
              </Typography>
            ) : null,
            ...menuItems,
          ]}
        </MuMenu>
      )}
    </Fragment>
  );
}
