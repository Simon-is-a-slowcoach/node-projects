const tableName = require('../models/db.js').topicTable;

exports.up = function (knex, Promise) {
    return knex.schema.createTable(tableName, table => {
        table.increments('id').primary();
        table.string('title', 20).notNullable();
        table.string('content').notNullable();
        table.integer('authorId').unsigned().notNullable();
        table.foreign('authorId').references('id').inTable('users').onDelete('CASCADE');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable(tableName);
};
