const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.post('/signup', (req, res, next) => {
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
});

router.post('/signin', (req, res) => {
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
});

router.get('/signout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.status(200).send({ message: '退出成功' });
    });
});

module.exports = router;