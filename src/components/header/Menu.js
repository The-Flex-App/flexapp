import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuMenu from '@material-ui/core/Menu';

const useStyles = makeStyles(() => ({
  menuPaper: {
    padding: 0,
    marginTop: 15,
  },
}));

export default function Menu(props) {
  const { menuItems, id, trigger } = props;
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
          id={id}
          classes={{ paper: classes.menuPaper }}
          anchorEl={anchorEl}
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
          {menuItems}
        </MuMenu>
      )}
    </Fragment>
  );
}
