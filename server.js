'use strict';

const path = require('path');
const fs = require('fs');
const koa = require('koa');
const compress = require('koa-compress');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const RedisStore = require('koa-redis');
const serve = require('koa-static');
const serialize = require('serialize-javascript');
const serverRenderer = require('vue-server-renderer');
const mount = require('koa-mount');
const router = require('koa-router')();
const c2k = require('koa-connect');
const LRU = require('lru-cache');

const api = require('./controllers')(router);
// const CSRF = require('koa-csrf');

const config = require('./config');

const app = module.exports = koa();

app.use(function* (next) {
  try {
    yield* next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});

app.use(compress());
app.use(mount('/assets', serve('./public')));
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.hsts({
  maxAge: config.hsts.maxAge,
  force: true,
  includeSubdomains: config.hsts.includeSubdomains
}));
app.use(bodyParser());

// session settings
app.use(session({
  key: config.session.key,
  prefix:config.session.prefix,
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  })
}));

/**
 * 根据指定标识符分割出头尾内容
 * @param {String} content 需要分割的内容
 * @param {String?} marker 标识符，默认 <!-- APP -->
 * @return {Object} object
 * @return {String} object.head
 * @return {String} object.tail
 */
function indexHTMLParse(content, marker) {
  marker = marker || '<!-- APP -->';
  const point = content.indexOf(marker);

  return {
    head: content.slice(0, point),
    tail: content.slice(point + marker.length)
  }
}

/**
 * 创建一个服务端的渲染器
 * @param  {String} bundle 打包后的代码
 * @return {Object}
 */
function createRenderer(bundle) {
  return serverRenderer.createBundleRenderer(bundle, {
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15 // 15 minutes
    })
  });
}

let indexHTML, renderer;

if (config.debug) {
  require('./build/dev-server')(app, {
    indexHTMLUpdated: function(content) {
      indexHTML = indexHTMLParse(content);
    },
    bundleUpdated: function(bundle) {
      renderer = createRenderer(bundle);
    }
  });
} else {
  let bundlePath = path.resolve(__dirname, 'dist/server-bundle.js'),
    indexPath = path.resolve(__dirname, 'dist/index.html');

  indexHTML = indexHTMLParse(fs.readFileSync(indexPath, 'utf8'));
  renderer = createRenderer(fs.readFileSync(bundlePath, 'utf8'));
}

router.use('/api', api.routes());

// Vue with server-side rendering
router.get('*', c2k(function (req, res){
  // 由于是以stream的方式输出，所以要设置下响应的内容类型
  res.setHeader('Content-Type', 'text/html');

  if (!renderer) {
    res.end('<h1>服务端渲染器正在编译... 要不你再刷新下看看？</h1>');
    return;
  }

  const context = {url: req.url};
  const renderStream = renderer.renderToStream(context);

  renderStream.once('data', () => {
    res.statusCode = 200;
    res.write(indexHTML.head);
  });

  renderStream.on('data', chunk => {
    res.write(chunk);
  });

  renderStream.on('end', () => {
    if (context.initialState) {
      res.write(
        `<script>var __INITIAL_STATE__ = ${
            serialize(context.initialState, {isJSON: true})
          }</script>`
      );
    }

    res.end(indexHTML.tail);
  });

  renderStream.on('error', err => {
    if (err && err.code === 404) {
      res.statusCode = 404;
      res.end('404 | Page Not Found');
      return;
    }

    res.statusCode = 500;
    res.end('500 | Internal Error');

    // 稍后记录日志
  });
}));

app
  .use(router.routes())
  .use(router.allowedMethods());

if (!module.parent) {
  app.listen(config.port);
}
