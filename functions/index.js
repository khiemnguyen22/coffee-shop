const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
    getAllOrders,
    postOneOrder,
    deleteOrder
} = require('./APIs/orders')

const {
    getAllDrinks,
    postDrink,
    deleteDrink
} = require('./APIs/drinks')

const {
    loginUser,
    signUpUser,
    getUserDetail
} = require('./APIs/users')

const {
    getAllCustomers,
    postOneCustomer,
    updateCustomer,
} = require('./APIs/customers')

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.get('/user', auth, getUserDetail);

// Orders
app.get('/orders', auth, getAllOrders);
app.post('/orders', auth, postOneOrder);
app.delete('/orders/:orderId', deleteOrder);

// Drinks
app.get('/drinks', getAllDrinks);
app.post('/drinks', postDrink);
app.delete('/drinks/:drinkID', deleteDrink);

// customers
app.get('/customers', getAllCustomers);
app.post('/customers', postOneCustomer);
app.post('/customers/:customerId', updateCustomer);

exports.api = functions.https.onRequest(app);
