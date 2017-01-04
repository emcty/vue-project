'use strict';

module.exports = {
  port: 3003,
  debug: true,

  log: {
    dir: 'logs/',
    level: 'DEBUG',
    pattern: '-yyyy-MM-dd.log'
  },

  db: {
    host: '10.100.140.12',
    dialect: 'mysql',
    database: 'open_platform',
    port: 3306,
    username: 'root',
    password: 'root123'
  },

  redis: {
    host: '10.100.140.14',
    port: 6379,
    password: '123456'
  },

  session: {
    key: 'SESSIONID',
    prefix: 'op:sess'
  },

  hsts: {
    maxAge: 31536000000,
    includeSubdomains: false
  }
}
