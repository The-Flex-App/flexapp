import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SettingMenu from './SettingMenu';
import WorkspaceMenu from './WorkspaceMenu';
import AccountMenu from './AccountMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function UserInfo() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <SettingMenu />
      <WorkspaceMenu />
      <AccountMenu />
    </div>
  );
}
