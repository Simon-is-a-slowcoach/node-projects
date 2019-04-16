var express = require('express');
var router = express.Router();

// /* GET listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

const apiUserRouter = require('./api_user.js');

router.use('/user', apiUserRouter);

module.exports = router;
