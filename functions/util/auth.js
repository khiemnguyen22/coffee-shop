const { admin, db } = require('./admin');

module.exports = (request, response, next) => {
	let idToken;
	if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
		idToken = request.headers.authorization.split('Bearer ')[1];
	} else {
		console.error('No token found');
		return response.status(403).json({ error: 'Unauthorized' });
	}
	admin
		.auth()
		.verifyIdToken(idToken)
		.then((decodedToken) => {
			request.baristas = decodedToken;
			return db.collection('baristas').where('userId', '==', request.baristas.uid).limit(1).get();
		})
		.then((data) => {
			request.baristas.username = data.docs[0].data().username;
			return next();
		})
		.catch((err) => {
			console.error('Error while verifying token', err);
			return response.status(403).json(err);
		});
};