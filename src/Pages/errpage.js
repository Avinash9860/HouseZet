import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Redirect } from 'react-router-dom';
import logo from '../media/logo.png';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	}
}));

export function MiniDrawer(props) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				onClick={<Redirect path="/Dashboard" />}
			>
				<Toolbar >
					<Typography variant="h5" style={{ cursor: 'pointer' }} noWrap>
						<img
							src={logo}
							alt="HouseZet"
							height="30px"
							borderradius="20px"
							style={{ marginRight: '16px', paddingTop: '5px' }}
						/>
						<Typography display="inline">"HouseZet"</Typography>
					</Typography>
				</Toolbar>
			</AppBar>

			<main className={classes.content}>
				<div className={classes.toolbar} />
				<div>
					404 err
				</div>
			</main>
		</div>
	);
}



export default MiniDrawer;
