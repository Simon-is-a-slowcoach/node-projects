exports.connect = () => {
    const app = require('../app.js');
    const knex = require('knex');
    const dbconfig = require('../knexfile.js');
    return knex(dbconfig[app.get('env')]);
};

exports.userTable = 'users';
exports.topicTable = 'topics';