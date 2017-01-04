'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const Sequelize = require('sequelize');
const config = require('../config').db;

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host,
    port: config.port
  }
);

let db = {
  Sequelize: Sequelize,
  sequelize: sequelize
};

// 读取当前目录下的所有model，排除隐藏文件，目录及本文件
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== __filename && fs.statSync(file).isFile())
  .forEach(file => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// 设置联合查询
Object.keys(db).forEach((name) => {
  if ("associate" in db[name]) {
    db[name].associate(db);
  }
});

module.exports = db;
