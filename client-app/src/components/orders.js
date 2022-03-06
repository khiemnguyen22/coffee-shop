import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Box from '@mui/material/Box';
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
import { authMiddleWare } from '../util/auth';
import styles from './styles'
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class orders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			orders: [],
            customers: [],
			drinks: [],
			display: [],

			items: [],
            drink: '',
			type: '',
			drinkNames: [],
			drinkTypes: [],

			price: 0,
            customer: '',
			customerEmail: '',
			newCustomer: false,
            quantity: 0,

			startTime: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false
		};

		// this.selectType = this.selectType.bind(this);
        // this.selectDrink = this.selectDrink.bind(this);

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
		const getOrder = axios.get('/orders')
		const getDrinks = axios.get('/drinks')
		const getCustomers = axios.get('/customers')
		axios
			.all([getOrder, getDrinks, getCustomers])
			.then(axios.spread((...responses) => {
				this.setState({
					orders: responses[0].data,
					drinks: responses[1].data,
					customers: responses[2].data,
					uiLoading: false
				});
				let types = this.state.drinks.map((drink) => drink.type)
				console.log(types)
				this.setState({
					drinkTypes: types.filter((type, index) => types.indexOf(type) === index)
				})
			}))
			.catch((err) => {
				console.log(err);
			});
	};




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

		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
                customer: '',
				customerEmail: '',
                type: '',
                drink: '',
                quantity: 0,
				startTime: new Date(),
				open: true
			});
		};

        const selectType = (event) =>{
            this.setState({
                type: event.target.value,
                drinkNames: this.state.drinks.filter((drink) => drink.type === event.target.value)
            });
        }
    
        const selectDrink = (event) =>{
            this.setState({ drink: event.target.value});
        }

		const renderTable = () => {
			return this.state.display.map((order, index) => (
				<tr key={index + 1} >
					<td>{order.drink}</td>
					<td>{order.quantity}</td>
					<td>{order.price}</td>
			 	</tr>
			))
		}

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			let endTime = new Date();
			let timeDiff = (endTime - this.state.startTime) / 1000;
			let bonus = false;
			if (this.state.isCustomer){
				let currCustomer = (this.state.customers.filter((customer) => 
									customer.name === this.state.customer &&
									customer.email === this.state.customerEmail))[0]
				let newSpending = {
					spending : currCustomer.spending + this.state.price,
					bonus: currCustomer.bonus
				}
				if (newSpending.spending >= (currCustomer.bonus + 1) * 50){
					bonus = true
					newSpending.bonus = newSpending.bonus + 1
				}
				axios
					.post(`/customers/${currCustomer.customerId}`, newSpending)
					.then(() =>{
						alert('update successfully')
					})
					.catch((error) => {
						this.setState({ open: true, errors: error.response.data });
						console.log(error);
					});
			}
			else if (this.state.customerEmail !== ''){
				let newCustomer = {
					name: this.state.customer,
					email: this.state.customerEmail,
					spending: this.state.price,
				}
				axios
					.post('/customers', newCustomer)
					.then(() =>{
						alert('added successfully')
					})
					.catch((error) => {
						this.setState({ open: true, errors: error.response.data });
						console.log(error);
					});
			}
			const newOrder= {
				customer: this.state.customer,
                price: this.state.price,
                orders: this.state.items,
                tip: 0,
				time: timeDiff
			};
			if (bonus){
				newOrder.orders.push('americano')
			}
			let options = {};
				options = {
					url: '/orders',
					method: 'post',
					data: newOrder
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

        const handleSave = (event) =>{
            event.preventDefault();
            let orderPrice = this.state.quantity * (this.state.drinks.filter((drink) => drink.name === this.state.drink)[0].price);
			let checkCustomer = (this.state.customers.filter((customer) => 
								customer.name === this.state.customer &&
								customer.email === this.state.customerEmail)).length === 1
			if (checkCustomer){
				this.setState({isCustomer: true})
			}
            this.setState(prevState => ({
                items: [...prevState.items, this.state.drink],
                price: this.state.price + orderPrice,
				display: [...prevState.display, {drink: this.state.drink, 
												quantity: this.state.quantity,
												price: orderPrice}]
            }))

        }

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
						aria-label="Add Todo"
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
									Add a new Order
								</Typography>
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                    <Button
                                        color="inherit"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        color="inherit"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Box>
							</Toolbar>
						</AppBar>

						<form className={classes.form} noValidate>
							<Grid container spacing={2}>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										id="customer email"
										label="Customer email"
										name="email"
										autoComplete="email"
										onChange={(e) => this.setState({customerEmail: e.target.value})}
									/>
								</Grid>

								<Grid item xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="customerName"
										label="Customer name"
										name="customer"
										autoComplete="customerName"
										helperText={errors.title}
										value={this.state.customer}
										error={errors.title ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<select style={{width: "100%"}} onChange={selectType}>
									<option value="">Select type</option>
									{this.state.drinkTypes.map((type) => (
										<option value={type}>{type}</option>
									))}
									</select>
								</Grid>

								<Grid item xs={12} >
									<select style={{width: "100%"}}  onChange={selectDrink} >
                                        <option value="" >Select drink</option>
                                        {this.state.drinkNames.map((drink) => (
                                            <option value={drink.name}>{drink.name}</option>
                                        ))}
									</select>
								</Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="quantity"
                                        label="quantity"
                                        name="quantity"
                                        autoComplete="quantity"
                                        helperText={errors.title}
                                        value={this.state.quantity}
                                        error={errors.title ? true : false}
                                        onChange={this.handleChange}
                                    />
                                </Grid>

							</Grid>
						</form>
						
						<br/>
						<table>
							<tbody>
								<tr styles={{border: "1px"}}>
									<th>drink</th>
									<th>quantity</th>
									<th>price</th>
								</tr>
								{renderTable()}
							</tbody>
						</table>
						<h1>Total price {this.state.price}</h1>
					</Dialog>

					<Grid container spacing={2}>
						{this.state.orders.map((order) => (
							<Grid item xs={12} sm={6}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography className={classes.pos} color="textSecondary">
											{order.customer}
										</Typography>
										<Typography variant="body2" component="p">
											drinks: {order.orders.map((order) => <span>{order}, </span>)}
										</Typography>
                                        <Typography variant="body2" component="p">
                                            price: {order.price}
                                        </Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary" >
											{' '}
											View{' '}
										</Button>
										<Button size="small" color="primary">
											Edit
										</Button>
										<Button size="small" color="primary">
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

export default withStyles(styles)(orders);