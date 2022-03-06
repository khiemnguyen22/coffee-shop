import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardActions, CardContent, Divider, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import styles from './styles'

class account extends Component {
	constructor(props) {
		super(props);

		this.state = {
            name: '',
			email: '',
			username: '',
            userID: '',
			uiLoading: true,
			buttonLoading: false,
			imageError: ''
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
                    userID: response.data.userCredentials.userId,
					name: response.data.userCredentials.name,
					email: response.data.userCredentials.email,
					username: response.data.userCredentials.username,
					uiLoading: false
				});
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};


	render() {
		const { classes, ...rest } = this.props;
		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
				
					<br />
					<Card {...rest} className={clsx(classes.root, classes)}>
						<form autoComplete="off" noValidate>
							<Divider />
							<CardContent>
								<Grid container spacing={3}>
									<Grid item md={12} xs={12}>
										<TextField
											fullWidth
											label="Name"
											margin="dense"
											name="name"
											variant="outlined"
											value={this.state.name}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item md={12} xs={12}>
										<TextField
											fullWidth
											label="Email"
											margin="dense"
											name="email"
											variant="outlined"
											disabled={true}
											value={this.state.email}
											onChange={this.handleChange}
										/>
									</Grid>
									
									<Grid item md={12} xs={12}>
										<TextField
											fullWidth
											label="Username"
											margin="dense"
											name="userHandle"
											disabled={true}
											variant="outlined"
											value={this.state.username}
											onChange={this.handleChange}
										/>
									</Grid>

                                    <Grid item md={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Employee ID"
                                        margin="dense"
                                        name="employeeID"
                                        disabled={true}
                                        variant="outlined"
                                        value={this.state.userID}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
								</Grid>
							</CardContent>
							<Divider />
							<CardActions />
						</form>
					</Card>
				</main>
			);
		}
	}
}

export default withStyles(styles)(account);