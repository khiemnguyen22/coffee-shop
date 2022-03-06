import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import styles from './styles'


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class menus extends Component {
	constructor(props) {
		super(props);

		this.state = {
			drinks: '',
			errors: [],
			type: '',
			name: '',
			price: '',
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false
		};

        this.deleteDrink = this.deleteDrink.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/drinks')
			.then((response) => {
				this.setState({
					drinks: response.data,
					uiLoading: false
				});
				// console.log(this.state.drinks)
			})
			.catch((err) => {
				console.log(err);
			});
	};

    deleteDrink(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let id = data.drink.drinkID;
		axios
			.delete(`drinks/${id}`)
			.then(() => {
                console.log('delete successfully')
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}


	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
				type: '',
				name: '',
				price: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const drink = {
				type: this.state.type,
				name: this.state.name,
				price: parseInt(this.state.price)
			};
			let options = {
				url: '/drinks',
				method: 'post',
				data: drink
			};
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

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

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Drink"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									Add a new Drink
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									Submit
								</Button>
							</Toolbar>
						</AppBar>

						<form className={classes.form} noValidate>
							<Grid container spacing={2}>

								<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="drinkType"
									label="drink Type"
									name="type"
									autoComplete="drinkType"
									helperText={errors.title}
									value={this.state.title}
									error={errors.title ? true : false}
									onChange={this.handleChange}
								/>
								</Grid>
							
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="drinkName"
										label="drink Name"
										name="name"
										autoComplete="drinkName"
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="drinkPrice"
										label="drink Price"
										name="price"
										autoComplete="drinkPrice"
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
		

							</Grid>
						</form>
					</Dialog>

					<Grid container spacing={2}>
						{this.state.drinks.map((drink) => (
							<Grid item xs={12} sm={6}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography variant="h5" component="h2">
											{drink.name}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											price: {drink.price}
										</Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            type: {drink.type}
                                        </Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary">
											Edit
										</Button>
										<Button size="small" color="primary" onClick={() => this.deleteDrink({ drink })}>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</main>
			);
		}
	}
}

export default withStyles(styles)(menus);