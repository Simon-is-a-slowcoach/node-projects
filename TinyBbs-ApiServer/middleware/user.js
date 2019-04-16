const User = require('../models/user');

module.exports = (req, res, next) => {
    const uid = req.session.uid;
    if (!uid) return next();
    User.getByUid(uid, (err, user) => {
        if (err) return next(err);
        if (!user || !user.id) return next(new Error('wrong uid'));
        req.user = user; //TODO req.locals.user?
        console.log(`session user: ${req.user && req.user.id}, ${new Date()}`);
        next();
    });
};