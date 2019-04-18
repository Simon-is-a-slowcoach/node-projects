const basicAuth = require('basic-auth');
const User = require('../models/user.js');

module.exports.signup = (req, res, next) => {
    const { username, password } = req.body;
    User.createNewData(username, password, (err, user) => {
        if (err) {
            // TODO: error code, 400 or 409?
            res.status(400).send({ message: err.message });
            return;
        };
        req.session.uid = user.id;
        res.status(200).send({
            data: {
                user: user.toJSON(),
            },
        });
    });
};

module.exports.signin = (req, res) => {
    const { username, password } = req.body;
    User.authenticate(username, password, (err, user) => {
        if (err) {
            res.status(401).send({
                message: err.message,
            });
            return;
        }
        if (!user) {
            res.status(404).send({
                message: 'no such user',
            });
            return;
        }
        req.session.uid = user.id;
        res.status(200).send({
            data: {
                user: user.toJSON(),
            },
        });
    });
};

module.exports.signout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.status(200).send({ message: '退出成功' });
    });
};

module.exports.get = (req, res, next) => {
    User.getByUid(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user || !user.id) return res.sendStatus(404);
        res.send({
            data: {
                user: user.toJSON(),
            },
        });
    });
};

module.exports.auth = (req, res, next) => {
    const { name: username, pass: password } = basicAuth(req);
    User.authenticate(username, password, (err, user) => {
        if (user) req.remoteUser = user;
        next(err);
    });
};