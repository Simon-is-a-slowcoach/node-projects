const apiUser = require('./api_user.js');

exports.auth = apiUser.auth;

// user api
exports.mapUserApis = (app) => {
    app.post('/api/user/signup', apiUser.signup);
    app.post('/api/user/signin', apiUser.signin);
    app.get('/api/user/signout', apiUser.signout);
    app.get('/api/user/:id', apiUser.get);
};