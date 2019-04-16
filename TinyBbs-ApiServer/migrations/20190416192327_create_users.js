const tableName = 'users';

exports.up = function (knex, Promise) {
    return knex.schema.createTable(tableName, table => {
        table.increments('id').primary();
        table.string('username', 20).unique().notNullable();
        table.string('password', 128).notNullable().comment('password hash');
        table.string('avatar').nullable();
        table.string('bio', 120).nullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable(tableName);
};
