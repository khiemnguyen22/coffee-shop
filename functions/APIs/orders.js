const { db } = require('../util/admin');

// GET Method
exports.getAllOrders = (request, response) => {
	db
		.collection('orders')
		.where('username', '==' , request.baristas.username)
		.get()
		.then((data) => {
			let orders = [];
			data.forEach((doc) => {
				orders.push({
                    orderId: doc.id,
                    orders: doc.data().orders,
					price: doc.data().price,
					time: doc.data().time,
                    customer: doc.data().customer,
                    // barista: doc.data().barista,
				});
			});
			return response.json(orders);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

// POST Method
exports.postOneOrder = (request, response) => {
    if(request.body.customer.trim() === '') {
        return response.status(400).json({ customer: 'Must not be empty' });
    }
	if(request.body.price === 0) {
        return response.status(400).json({ price: 'Must not be 0' });
    }
	if(request.body.orders.length === 0) {
        return response.status(400).json({ orders: 'Must not be empty' });
    }
    const newOrder = {
        customer: request.body.customer,
        username: request.baristas.username,
		price: request.body.price,
		orders: request.body.orders,
        tip: request.body.tip,
		time: request.body.time,
    }
    db
        .collection('orders')
        .add(newOrder)
        .then((doc)=>{
            const responseOrder = newOrder;
            responseOrder.id = doc.id;
            return response.json(responseOrder);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

// delete Method
exports.deleteOrder = (request, response) => {
    const document = db.doc(`/orders/${request.params.orderID}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Order not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};
