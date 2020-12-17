import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { deepOrange } from '@material-ui/core/colors';
import MenuItem from '@material-ui/core/MenuItem';
import LinkIcon from '@material-ui/icons/Link';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import { copyToClipboard } from '../../utils/misc';
import { ADD_INVITE, REMOVE_USER_WORKSPACE } from '../../graphql/mutations';
import Menu from './Menu';
import { setWorkspaceMemberList } from '../../store/slices/user';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 8,
  },
  menuItemRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  circle: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    marginRight: 10,
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

const MemberMenuItem = forwardRef((props, ref) => {
  const classes = useStyles();
  const { id: userId, firstName, lastName, picUrl, onRemove } = props;

  const handleRemoveMember = (e) => {
    e.stopPropagation();
    onRemove(userId);
  };

  return (
    <MenuItem classes={{ root: classes.menuItemRoot }} innerRef={ref}>
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
});

export default function SettingMenu(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { id: userId, role, workspaceId, workspaceMembers } = useSelector(
    ({ users }) => {
      return users.loggedInUser || {};
    }
  );

  const [addInvite] = useMutation(ADD_INVITE);
  const [removeUserWorkspace] = useMutation(REMOVE_USER_WORKSPACE);

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

  const handleRemoveUserWorkspace = (memberId) => {
    removeUserWorkspace({
      variables: {
        input: { ownerUserId: userId, userId: memberId, workspaceId },
      },
    })
      .then((response) => {
        dispatch(setWorkspaceMemberList(response.data.removeUserWorkspace));
      })
      .catch((e) => {
        // Handle error
        console.error(e);
      });
  };

  if (role !== 'owner') {
    return null;
  }

  return (
    <Menu
      id='menu-appbar'
      trigger={
        <IconButton
          aria-label='setting of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          color='inherit'
          classes={{ root: classes.buttonRoot }}
        >
          <SettingsRoundedIcon />
        </IconButton>
      }
      menuItems={[
        ...(workspaceMembers
          ? workspaceMembers.map((workspace, index) => (
              <MemberMenuItem
                {...workspace}
                key={index}
                onRemove={handleRemoveUserWorkspace}
              />
            ))
          : []),
        <MenuItem onClick={handleCopyToClipboard} key={'copy-board-link'}>
          {' '}
          <LinkIcon classes={{ root: classes.copylink }} /> Copy board link
        </MenuItem>,
      ]}
    />
  );
}