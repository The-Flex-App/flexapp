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
		flexGrow: 1
	},
	flexTitle: {
		fontWeight: 'bold',
		display: 'inline-block',
		fontSize: '19pt',
		padding: '0 15px',
		background: '#0199ad',
		height: 40,
		lineHeight: '40px',
		color: '#FFF'
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
						<div className={classes.flexTitle}>FLEX</div>
					</Typography>
					<UserInfo />
				</Toolbar>
			</AppBar>
		</div>
	);
}
