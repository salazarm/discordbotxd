//TODO: comment
const db = require('../db/config');

const User = {};

User.findAll = function(){
	return db.client.connect(db.url)
		.then(connection => {
			let selectedDb = connection.db(db.name);
			return selectedDb.collection('users')
				.find({}).toArray()
				.then(response => {
					connection.close();
					console.log(response)
					return response;
				})
		})
};

User.findById = function(id){
	return db.client.connect(db.url)
		.then(connection => {
			let selectedDb = connection.db(db.name);
			return selectedDb.collection('users')
				.find({"_id": db.objectId.createFromHexString(id)}).toArray()
				.then(response => {
					connection.close();
					console.log(response)
					return response;
				})
		})
};

User.create = function(user){
	return db.client.connect(db.url)
		.then(connection => {
			let selectedDb = connection.db(db.name);
			return selectedDb.collection('users')
				.insertOne(user)
				.then(response => {
					connection.close();
					console.log(response)
					return response;
				})
		})
};

User.update = function(id, property, newValue){
	return db.client.connect(db.url)
		.then(connection => {
			let selectedDb = connection.db(db.name);
			if (newValue) { 
				return selectedDb.collection('users')
					.findOneAndUpdate(
						{"_id": db.objectId.createFromHexString(id)},
						{$set: { [property]: newValue }},
						{returnOriginal: false}
					)
					.then(response => {
						connection.close();
						console.log(response)
						return response;
					})
			}
			else { 
				return selectedDb.collection('users')
					.findOneAndUpdate(
						{"_id": db.objectId.createFromHexString(id)},
						{$unset: { [property]: 1 }},
						{returnOriginal: false}
					)
					.then(response => {
						connection.close();
						console.log(response)
						return response;
					})
			}
		})
};

module.exports = User;
