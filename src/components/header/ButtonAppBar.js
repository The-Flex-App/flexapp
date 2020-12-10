import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import UserInfo from './UserInfo';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	title: {
		flexGrow: 1,
		fontWeight: 'bold',
		color: '#414bb2'
	},
	appBarRoot: {
		padding: 0
	}
}));

export default function ButtonAppBar() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<AppBar
				position="static"
				color="transparent"
				classes={{ root: classes.appBarRoot }}
			>
				<Toolbar>
					<Typography variant="h5" className={classes.title}>
						Flex
					</Typography>
					<UserInfo />
				</Toolbar>
			</AppBar>
		</div>
	);
}
