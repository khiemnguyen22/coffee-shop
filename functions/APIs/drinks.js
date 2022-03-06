const { db } = require('../util/admin');

// GET Method
exports.getAllDrinks = (request, response) => {
	db
		.collection('drinks')
		.orderBy('type')
		.get()
		.then((data) => {
			let drinks = [];
			data.forEach((doc) => {
				drinks.push({
					price: doc.data().price,
					type: doc.data().type,
                    name: doc.data().name,
                    drinkID: doc.id
				});
			});
			return response.json(drinks);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

// POST Method
exports.postDrink = (request, response) => {
	if (request.body.type.trim() === '') {
		return response.status(400).json({ type: 'Must not be empty' });
    }
    
    if(request.body.name.trim() === '') {
        return response.status(400).json({ name: 'Must not be empty' });
    }
	if(request.body.price === 0) {
        return response.status(400).json({ price: 'Must not be 0' });
    }

    const newDrink = {
        type: request.body.type,
        name: request.body.name,
		price: request.body.price,
    }
    db
        .collection('drinks')
        .add(newDrink)
        .then((doc)=>{
            const responseDrink = newDrink;
            responseDrink.drinkID = doc.id;
            return response.json(responseDrink);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

// delelete Method
exports.deleteDrink = (request, response) => {
    const document = db.doc(`/drinks/${request.params.drinkID}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Drink not found' })
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
