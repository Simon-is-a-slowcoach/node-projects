const express = require('express');
const app = module.exports = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

const user = require('./middleware/user.js');

const indexRouter = require('./routes/index.js');
const apiRouter = require('./routes/api.js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter.userRouter.auth);
app.use(user);

app.use('/', indexRouter);
app.use('/api', apiRouter);