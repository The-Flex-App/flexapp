import React, { useContext } from 'react';
import UserContext from '../../utils/userContext';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingMenu from './SettingMenu';
import WorkspaceMenu from './WorkspaceMenu';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 8,
  },
}));

export default function UserInfo() {
  const classes = useStyles();

  const { signOut } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div>
      <SettingMenu />
      <WorkspaceMenu />
      <IconButton
        aria-label='logout'
        classes={{ root: classes.buttonRoot }}
        color='inherit'
        onClick={handleLogout}
      >
        <ExitToAppIcon />
      </IconButton>
    </div>
  );
}
