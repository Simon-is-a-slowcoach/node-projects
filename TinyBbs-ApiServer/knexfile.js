
module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'dbuser',
            password: 'password',
            database: 'tinybbsdb',
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'tinybbsdb_migrations',
        },
    },
}