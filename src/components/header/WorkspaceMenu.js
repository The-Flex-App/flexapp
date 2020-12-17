import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { deepOrange } from '@material-ui/core/colors';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { REMOVE_USER_WORKSPACE } from '../../graphql/mutations';
import Menu from './Menu';
import { setWorkspaceMemberList } from '../../store/slices/user';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 0,
    marginLeft: 10,
    marginRight: 10,
  },
  menuItemRoot: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  square: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    marginRight: 10,
    boxShadow: '0 5px 5px -2px rgba(0, 0, 0, 0.4)',
  },
  accountAvatar: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
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
    picUrl,
    onRemove,
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
      <ItemComponent className={classes.link} href={`/${workspaceId}`}>
        <Avatar
          variant='square'
          alt={`${firstName} ${lastName}`}
          src={picUrl}
          className={classes.square}
        />
        <div className={classes.menuText}>{`${firstName} ${lastName}`}</div>
      </ItemComponent>
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
    </MenuItem>
  );
});

export default function WorkspaceMenu(props) {
  const classes = useStyles();
  const { workspaceId: activeWorkspaceId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const { id: userId, workspaces, firstName, lastName } = useSelector(
    ({ users }) => {
      return users.loggedInUser || {};
    }
  );

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

  return (
    <Menu
      id='menu-appbar'
      trigger={
        <IconButton
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          color='inherit'
          classes={{ root: classes.buttonRoot }}
        >
          <Avatar
            variant='square'
            alt={firstName ? `${firstName} ${lastName}` : ''}
            src={'./user.png'}
            className={classes.accountAvatar}
          />
        </IconButton>
      }
      menuItems={workspaces.map((workspace, index) => (
        <WorkspacerMenuItem
          {...workspace}
          key={index}
          onRemove={handleRemoveUserWorkspace}
          isActive={workspace.workspaceId === activeWorkspaceId}
        />
      ))}
    />
  );
}
