
/* eslint no-console: 0 */

'use strict';

const express = require('express');
const chalk = require('chalk');
const path = require('path');
const requireDir = require('require-dir');
const router = express.Router();
const config = require('./config').dev.mock;

const app = express();

const contentBase = path.resolve('mock/');
const port = config.port;

const routesModules = requireDir(contentBase, {recurse: true});


for (let name in routesModules) {
  if (
    routesModules.hasOwnProperty(name)
  ) {
    if (typeof routesModules[name] === 'function') {
      routesModules[name](router);
    } else {
      console.error(chalk.red('%s%s.js is invalid routes modules'), contentBase + path.sep, name);
    }
  }
}

app.use(router);

app.listen(port, '0.0.0.0', (err) => {

  if (err) {
    console.error(chalk.red(err));
    return;
  }

  console.log(chalk.green('\nMock server listening at http://localhost:%s.\n'), port);
});
