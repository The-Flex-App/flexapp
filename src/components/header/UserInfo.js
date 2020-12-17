import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import UserContext from '../../utils/userContext';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { deepOrange } from '@material-ui/core/colors';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import LinkIcon from '@material-ui/icons/Link';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { copyToClipboard } from '../../utils/misc';
import { ADD_INVITE, REMOVE_USER_WORKSPACE } from '../../graphql/mutations';
import Menu from './Menu';
import { setWorkspaceMemberList } from '../../store/slices/user';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  settingButtonRoot: {
    padding: 8,
  },
  logoutButtonRoot: {
    padding: 8,
  },
  buttonRoot: {
    padding: 0,
    marginLeft: 10,
    marginRight: 10,
  },
  accountCircleRoot: {
    fontSize: 40,
  },
  menuPaper: {
    padding: 0,
    marginTop: 15,
  },
  menuItemRoot: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  memberMenuItemRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  square: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    marginRight: 10,
    boxShadow: '0 5px 5px -2px rgba(0, 0, 0, 0.4)',
  },
  circle: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    marginRight: 10,
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
  copylink: {
    marginRight: 10,
    width: 40,
  },
}));

const getWorkspaceMenuItem = (
  data,
  classes,
  index,
  handleRemoveUserWorkspace,
  activeWorkspaceId
) => {
  const { workspaceId, firstName, lastName, picUrl } = data;

  const handleRemoveWorkspace = (e) => {
    e.stopPropagation();
    handleRemoveUserWorkspace({ workspaceId });
  };

  const ItemComponent = activeWorkspaceId === workspaceId ? 'div' : Link;

  return (
    <MenuItem
      key={index}
      selected={activeWorkspaceId === workspaceId}
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
};

const getMemberMenuItem = (data, classes, index, handleRemoveUserWorkspace) => {
  const { id: userId, firstName, lastName, picUrl } = data;

  const handleRemoveMember = (e) => {
    e.stopPropagation();
    handleRemoveUserWorkspace({ userId });
  };

  return (
    <MenuItem key={index} classes={{ root: classes.memberMenuItemRoot }}>
      <div className={classes.link}>
        <Avatar
          variant='circular'
          alt={`${firstName} ${lastName}`}
          src={picUrl}
          className={classes.circle}
        />
        <div className={classes.menuText}>{`${firstName} ${lastName}`}</div>
      </div>
      <IconButton
        aria-label='remove'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={handleRemoveMember}
        color='inherit'
        classes={{ root: classes.removeButtonRoot }}
      >
        <HighlightOffIcon />
      </IconButton>
    </MenuItem>
  );
};

export default function UserInfo() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    id: userId,
    role,
    workspaceId,
    memberWorkspaceInfo,
    ownerWorkspaceInfo,
    firstName,
    lastName,
  } = useSelector(({ users }) => {
    return users.loggedInUser || {};
  });
  const { workspaceId: activeWorkspaceId } = useParams();
  const [addInvite] = useMutation(ADD_INVITE);
  const [removeUserWorkspace] = useMutation(REMOVE_USER_WORKSPACE);

  const { signOut } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
  };

  const handleCopyToClipboard = () => {
    addInvite({
      variables: { input: { userId, workspaceId } },
    })
      .then((response) => {
        const { id } = response.data.createInvitaton;
        const url = `${window.location.origin}/${workspaceId}/${id}`;
        copyToClipboard(url);
      })
      .catch((e) => {
        // Handle error
        console.error(e);
      });
  };

  const handleRemoveUserWorkspace = (data) => {
    removeUserWorkspace({
      variables: {
        input: { currentUserId: userId, userId, workspaceId, ...data },
      },
    })
      .then((response) => {
        dispatch(setWorkspaceMemberList(response.data.removeUserWorkspace));
        if (
          activeWorkspaceId &&
          data.workspaceId &&
          activeWorkspaceId === data.workspaceId
        ) {
          history.push('/');
        }
      })
      .catch((e) => {
        // Handle error
        console.error(e);
      });
  };

  return (
    <div>
      {role === 'owner' && (
        <Menu
          id='menu-appbar'
          trigger={
            <IconButton
              aria-label='setting of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              color='inherit'
              classes={{ root: classes.settingButtonRoot }}
            >
              <SettingsRoundedIcon />
            </IconButton>
          }
          menuItems={[
            ...(ownerWorkspaceInfo
              ? ownerWorkspaceInfo.map((workspace, index) =>
                  getMemberMenuItem(
                    workspace,
                    classes,
                    index,
                    handleRemoveUserWorkspace
                  )
                )
              : []),
            <MenuItem onClick={handleCopyToClipboard} key={'copy-board-link'}>
              {' '}
              <LinkIcon classes={{ root: classes.copylink }} /> Copy board link
            </MenuItem>,
          ]}
        />
      )}
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
        menuItems={
          memberWorkspaceInfo
            ? memberWorkspaceInfo.map((workspace, index) =>
                getWorkspaceMenuItem(
                  workspace,
                  classes,
                  index,
                  handleRemoveUserWorkspace,
                  activeWorkspaceId
                )
              )
            : []
        }
      />
      <IconButton
        aria-label='logout'
        classes={{ root: classes.logoutButtonRoot }}
        color='inherit'
        onClick={handleLogout}
      >
        <ExitToAppIcon />
      </IconButton>
    </div>
  );
}
