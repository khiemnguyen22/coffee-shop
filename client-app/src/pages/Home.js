import React, { Component } from 'react';
import axios from 'axios';

import Account from '../components/account';
import Orders from '../components/orders';
import Menu from '../components/menus';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './homeStyles'

import { authMiddleWare } from '../util/auth'

const drawerWidth = 240;


function Loading(props){
	const page = props.render
	if (page === 'account'){
		return <Account />;
	} 
	else if (page === 'order'){
		return <Orders />;
	}
	else{
		return <Menu />;
	}
}

class home extends Component {
	state = {
		render: ''
	};

	loadAccountPage = (event) => {
		this.setState({ render: 'account' });
	};

	loadOrderPage = (event) => {
		this.setState({ render: 'order' });
	};

	loadMenuPage = (event) => {
		this.setState({ render: 'menu' });
	};


	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		window.location.href = "/login";
	};

	constructor(props) {
		super(props);

		this.state = {
			name: '',
			uiLoading: true,
		};
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				console.log(response.data);
				this.setState({
					email: response.data.userCredentials.email,
                    name: response.data.userCredentials.name,
					username: response.data.userCredentials.username,
					uiLoading: false,
				});
			})
			.catch((error) => {
				if(error.response.status === 403) {
					window.location.href = "/login";
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	render() {
		const { classes } = this.props;		
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</div>
			);
		} else {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" noWrap>
								Coffee Shop
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar src={this.state.profilePicture} className={classes.avatar} />
							<p>
								{' '}
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
						<List>

							<ListItem button key="Orders" onClick={this.loadOrderPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Orders" />
							</ListItem>

							<ListItem button key="Account" onClick={this.loadAccountPage}>
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Account" />
							</ListItem>

							<ListItem button key="Menu" onClick={this.loadMenuPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Menu" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>

					<div><Loading render={this.state.render}/></div>
				</div>
			);
		}
	}
}

export default withStyles(styles)(home);