
/* eslint no-console: 0 */

'use strict';

const koa = require('koa');
const chalk = require('chalk');
const path = require('path');
const requireDir = require('require-dir');
const chalk = require('chalk');
const router = require('koa-router')();

const app = koa();

const contentBase = path.resolve('mock/');
const port = 8092;

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

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, '0.0.0.0', (err) => {

  if (err) {
    console.error(chalk.red(err));
    return;
  }

  console.log(chalk.green('\nMock server listening at http://localhost:%s.\n'), port);
});
