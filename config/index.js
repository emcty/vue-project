/**
 * Copyright 2016 creditease Inc. All rights reserved.
 * @description 根据环境变量NODE_ENV定义项目运行环境
 * @author evan2x(aiweizhang@creditease.cn)
 * @date  2016/03/03
 */

'use strict';

const env = process.env.NODE_ENV;

if (env === 'production') {
  module.exports = require('./config.production');
} else if (env === 'testing') {
  module.exports = require('./config.testing');
} else {
  module.exports = require('./config.development');
}
