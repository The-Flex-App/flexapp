import React, { useContext } from 'react';
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
import { copyToClipboard } from '../../utils/misc';
import { ADD_INVITE } from '../../graphql/mutations';
import Menu from './Menu';

const useStyles = makeStyles((theme) => ({
	settingButtonRoot: {
		padding: 8
	},
	buttonRoot: {
		padding: 0,
		marginLeft: 10,
		marginRight: 10
	},
	accountCircleRoot: {
		fontSize: 40
	},
	menuPaper: {
		padding: 0,
		marginTop: 15
	},
	menuItemRoot: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	memberMenuItemRoot: {
		display: 'flex',
		justifyContent: 'space-between',
		cursor: 'default',
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},
	square: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500],
		marginRight: 10,
		boxShadow: '0 5px 5px -2px rgba(0, 0, 0, 0.4)'
	},
	circle: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500],
		marginRight: 10
	},
	accountAvatar: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500],
		boxShadow: '0 5px 5px -2px rgba(0, 0, 0, 0.4)'
	},
	link: {
		display: 'flex',
		alignItems: 'center',
		color: theme.palette.text.secondary,
		'&:hover': {
			textDecoration: 'none'
		}
	},
	removeButtonRoot: {
		padding: 5,
		marginLeft: 10
	},
	copylink: {
		marginRight: 10,
		width: 40
	}
}));

const getWorkspaceMenuItem = (data, classes, index) => {
	const { workspaceId, firstName, lastName, picUrl } = data;

	const handleRemoveWorkspace = () => {};

	return (
		<MenuItem key={index} classes={{ root: classes.menuItemRoot }}>
			<Link className={classes.link} href={`/${workspaceId}`}>
				<Avatar
					variant="square"
					alt={`${firstName} ${lastName}`}
					src={picUrl}
					className={classes.square}
				/>
				{`${firstName} ${lastName}`}
			</Link>
			<IconButton
				aria-label="remove"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={handleRemoveWorkspace}
				color="inherit"
				classes={{ root: classes.removeButtonRoot }}
			>
				<HighlightOffIcon />
			</IconButton>
		</MenuItem>
	);
};

const getMemberMenuItem = (data, classes, index) => {
	const { firstName, lastName, picUrl } = data;

	const handleRemoveMember = () => {};

	return (
		<MenuItem key={index} classes={{ root: classes.memberMenuItemRoot }}>
			<div className={classes.link}>
				<Avatar
					variant="circular"
					alt={`${firstName} ${lastName}`}
					src={picUrl}
					className={classes.circle}
				/>
				{`${firstName} ${lastName}`}
			</div>
			<IconButton
				aria-label="remove"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={handleRemoveMember}
				color="inherit"
				classes={{ root: classes.removeButtonRoot }}
			>
				<HighlightOffIcon />
			</IconButton>
		</MenuItem>
	);
};

export default function UserInfo() {
	const classes = useStyles();
	const {
		id: userId,
		workspaceId,
		memberWorkspaceInfo,
		ownerWorkspaceInfo,
		firstName,
		lastName
	} = useSelector(({ users }) => {
		return users.loggedInUser || {};
	});
	const [addInvite] = useMutation(ADD_INVITE);

	// eslint-disable-next-line no-unused-vars
	const { signOut } = useContext(UserContext);

	// const handleLogout = () => {
	// 	signOut();
	// };

	const handleCopyToClipboard = () => {
		addInvite({
			variables: { input: { userId, workspaceId } }
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

	return (
		<div>
			<Menu
				id="menu-appbar"
				trigger={
					<IconButton
						aria-label="setting of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						color="inherit"
						classes={{ root: classes.settingButtonRoot }}
					>
						<SettingsRoundedIcon />
					</IconButton>
				}
				menuItems={[
					...(ownerWorkspaceInfo
						? ownerWorkspaceInfo.map((workspace, index) =>
								getMemberMenuItem(workspace, classes, index)
						  )
						: []),
					<MenuItem onClick={handleCopyToClipboard} key={'copy-board-link'}>
						{' '}
						<LinkIcon classes={{ root: classes.copylink }} /> Copy board link
					</MenuItem>
				]}
			/>
			<Menu
				id="menu-appbar"
				trigger={
					<IconButton
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						color="inherit"
						classes={{ root: classes.buttonRoot }}
					>
						<Avatar
							variant="square"
							alt={firstName ? `${firstName} ${lastName}` : ''}
							src={'./user.png'}
							className={classes.accountAvatar}
						/>
					</IconButton>
				}
				menuItems={
					memberWorkspaceInfo
						? memberWorkspaceInfo.map((workspace, index) =>
								getWorkspaceMenuItem(workspace, classes, index)
						  )
						: []
				}
			/>
		</div>
	);
}
