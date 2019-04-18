const express = require('express');
const router = express.Router();

const apiUserRouter = require('./api_user.js');

router.use('/user', apiUserRouter);

module.exports = router;
module.exports.userRouter = apiUserRouter;