import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from './Menu';
import UserContext from '../../utils/userContext';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 8,
  },
}));

export default function AccountMenu(props) {
  const classes = useStyles();

  const { signOut } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
  };

  return (
    <Menu
      id='menu-appbar'
      trigger={
        <IconButton
          aria-label='account menu'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          color='inherit'
          classes={{ root: classes.buttonRoot }}
        >
          <AccountCircleIcon />
        </IconButton>
      }
      menuItems={[
        <MenuItem onClick={handleLogout} key={'logout-link'}>
          Logout
        </MenuItem>,
      ]}
    />
  );
}
