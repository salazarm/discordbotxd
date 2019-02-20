var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
	// Comment out this line:
  //res.send('respond with a resource');

  // And insert something like this instead:
  res.json({
  	bots: [{
      name: 'testbot',
      id: 4,
    }],
    jobs: [],
  });
});

module.exports = router;
