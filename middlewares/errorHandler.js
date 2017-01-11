
const logger = require('../common/logger').logger;

function render(fragment) {
  return `
    <!DOCTYPE>
    <html>
      <head>
        <title>开放平台</title>
        <style>
          h1 {
            text-align: center;
            padding-top: 100px;
            font-size: 50px;
          }
        </style>
      </head>
      <body>
      ${fragment}
      </body>
    </html>
  `;
}

module.exports = function() {
  return function* (next) {
    const ctx = this;
    try {
      yield next;
    } catch (err) {
      ctx.status = err.status || err.code || 500;

      if (ctx.is('json', 'urlencoded')) {
        ctx.body = {
          status: 10001,
          msg: err.message
        };
      } else {
        switch (ctx.status) {
          // 如果vue-router处理了404，那其实这里并没有什么卵用。
          case 404:
            ctx.body = render('<h1>404 | Page Not Found</h1>');
            break;
          default:
            ctx.body = render('<h1>Internal Server Error</h1>');
        }
      }

      this.app.emit('error', err, this);
      logger.error(err);
    }
  }
}
