/**
 * Copyright 2016 creditease Inc. All rights reserved.
 * @description 日志模块，封装了访问日志及
 * @author evan2x(aiweizhang@creditease.cn)
 * @date  2017/01/03
 */

'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('koa-log4');
const mkdirp = require('mkdirp');

const config = require('../config').log;

mkdirp.sync(config.dir);

log4js.configure({
  appenders: [
    {
      type: 'dateFile',
      pattern: config.pattern,
      filename: path.join(config.dir, 'access.log'),
      category: 'access'
    },
    {
      type: 'dateFile',
      pattern: config.pattern,
      level: config.level,
      filename: path.join(config.dir, 'application.log'),
      category: 'application'
    }
  ]
});

exports.access = () => log4js.koaLogger(
  log4js.getLogger('access'),
  {
    level: log4js.levels.INFO
  }
);

exports.logger = log4js.getLogger('application');
