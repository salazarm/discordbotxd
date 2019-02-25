//TODO: Comment
const Mongo = {};

Mongo.client = require('mongodb').MongoClient;
Mongo.objectId = require('mongodb').ObjectID;
//TODO: Make this point to a variable set elsewhere
Mongo.url = 'mongodb://localhost:27017';
//TODO: this too
Mongo.name = 'fc-dev'

module.exports = Mongo;
