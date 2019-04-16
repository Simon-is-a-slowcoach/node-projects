const knex = require('knex');
const dbconfig = require('../knexfile.js');

const db = knex(dbconfig[require('../app.js').get('env')]);

module.exports = db;