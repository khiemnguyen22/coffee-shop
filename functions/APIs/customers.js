const { db } = require('../util/admin');

// GET Method
// GET Method
exports.getAllCustomers = (request, response) => {
	db
		.collection('customers')
		.orderBy('spending', 'desc')
		.get()
		.then((data) => {
			let customers = [];
			data.forEach((doc) => {
				customers.push({
                    customerId: doc.id,
					name: doc.data().name,
					spending: doc.data().spending,
					email: doc.data().email,
                    bonus: doc.data().bonus
				});
			});
			return response.json(customers);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

// POST Method
exports.postOneCustomer = (request, response) => {
    if(request.body.name.trim() === '') {
        return response.status(400).json({ name: 'Must not be empty' });
    }

    const newCustomer = {
        name: request.body.name,
		email: request.body.email,
        bonus: 0,
    }
    db
        .collection('customers')
        .add(newCustomer)
        .then((doc)=>{
            const responseCustomer = newCustomer;
            responseCustomer.id = doc.id;
            return response.json(responseCustomer);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

// Update method
exports.updateCustomer = (request, response) => {
    let document = db.collection('customers').doc(`${request.params.customerId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((error) => {
        console.error(error);
        return response.status(500).json({ 
            message: "Cannot Update the value"
        });
    });
}