module.exports = {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 8080,
      user: 'root',
      password: 'rootroot',
      database: 'focusflow'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  };