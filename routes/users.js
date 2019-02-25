const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

/* Simulate a token */
router.token = "peepee";

/* GET users listing. */
router.get('/', function(req, res, next) {
	// Comment out this line:
  //res.send('respond with a resource');

  // And insert something like this instead:
	User.findAll()
		.then(response => {
			res.json(response)
		}).catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// Creating a new user
router.post('/', function(req, res, next) {
	const salt = bcrypt.genSaltSync();
	const hash = bcrypt.hashSync(req.body.password_digest, salt);
	const newUser = {
		username: req.body.username,
		password_digest: hash
	}
	User.create(newUser)
		.then(response => {
			res.json(response)
		}).catch(err => {
			console.log(err);
			res.status(500).json(err);
		})
});

module.exports = router;
