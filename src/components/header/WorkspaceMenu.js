import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MenuItem from '@material-ui/core/MenuItem';
import DehazeIcon from '@material-ui/icons/Dehaze';
import Link from '@material-ui/core/Link';
import { REMOVE_USER_WORKSPACE } from '../../graphql/mutations';
import { setWorkspaceMemberList } from '../../store/slices/user';
import { useHistory, useParams } from 'react-router-dom';
import { getAvatarChars, getFullName } from '../../utils/misc';
import Menu from './Menu';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 0,
    margin: theme.spacing(0, 1),
    fontSize: 18,
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  menuItemRoot: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  square: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    marginRight: theme.spacing(1),
    boxShadow: '0 5px 5px -2px rgba(0, 0, 0, 0.4)',
  },
  accountAvatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    boxShadow: '0 5px 5px -2px rgba(0, 0, 0, 0.4)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    '&:hover': {
      textDecoration: 'none',
    },
  },
  menuText: {
    width: 180,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButtonRoot: {
    padding: 5,
    marginLeft: 10,
  },
}));

const WorkspacerMenuItem = forwardRef((props, ref) => {
  const classes = useStyles();
  const {
    workspaceId,
    firstName,
    lastName,
    email,
    picUrl,
    onRemove,
    isRemovable = true,
    isActive,
  } = props;

  const handleRemoveWorkspace = (e) => {
    e.stopPropagation();
    onRemove(workspaceId);
  };

  const ItemComponent = isActive ? 'div' : Link;

  return (
    <MenuItem
      innerRef={ref}
      selected={isActive}
      classes={{ root: classes.menuItemRoot }}
    >
      <ItemComponent
        className={classes.link}
        href={`/dashboards/${workspaceId}`}
      >
        <Avatar
          variant='square'
          className={classes.square}
          alt={getFullName(firstName, lastName, email)}
          src={picUrl ? picUrl : ''}
        >
          {getAvatarChars(firstName, lastName) || <DehazeIcon />}
        </Avatar>
        <div className={classes.menuText}>
          {getFullName(firstName, lastName, email)}
        </div>
      </ItemComponent>
      {isRemovable && (
        <IconButton
          aria-label='remove'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={handleRemoveWorkspace}
          color='inherit'
          classes={{ root: classes.removeButtonRoot }}
        >
          <HighlightOffIcon />
        </IconButton>
      )}
    </MenuItem>
  );
});

export default function WorkspaceMenu(props) {
  const classes = useStyles();
  const { workspaceId: activeWorkspaceId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    id: userId,
    workspaces,
    firstName,
    lastName,
    email,
    workspaceId,
  } = useSelector(({ users }) => {
    return users.loggedInUser || {};
  });

  const workspaceList = [
    { firstName, lastName, email, workspaceId },
    ...(workspaces || []),
  ];

  const [removeUserWorkspace] = useMutation(REMOVE_USER_WORKSPACE);

  const handleRemoveUserWorkspace = (workspaceId) => {
    removeUserWorkspace({
      variables: {
        input: { ownerUserId: userId, userId, workspaceId },
      },
    })
      .then((response) => {
        dispatch(setWorkspaceMemberList(response.data.removeUserWorkspace));
        if (activeWorkspaceId && activeWorkspaceId === workspaceId) {
          history.push('/');
        }
      })
      .catch((e) => {
        // Handle error
        console.error(e);
      });
  };

  if (!workspaces) {
    return null;
  }

  return (
    <Menu
      id='menu-appbar'
      trigger={
        <Typography
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          classes={{ root: classes.buttonRoot }}
        >
          {getFullName(firstName, lastName, email)}'s board
        </Typography>
      }
      menuItemsTitle={'Boards shared with me'}
      menuItems={workspaceList.map((workspace, index) => (
        <WorkspacerMenuItem
          {...workspace}
          key={index}
          isRemovable={workspace.workspaceId !== workspaceId}
          onRemove={handleRemoveUserWorkspace}
          isActive={
            workspace.workspaceId === activeWorkspaceId ||
            (!activeWorkspaceId && workspace.workspaceId === workspaceId)
          }
        />
      ))}
    />
  );
}
