'use strict';

const EventEmitter = require('events').EventEmitter;
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MemoryFS = require('memory-fs');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');

const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

/**
 * 转换webpack dev中间件
 * @param  {Function} middleware
 * @return {GeneratorFunction}
 */
function convertDevMiddleware(middleware) {
  function* gen(next) {
    const ctx = this;
    const step = yield function(done) {
      middleware(ctx.req, {
        end: function(content) {
          ctx.body = content;
          done(null, false);
        },
        setHeader: function(name, value) {
          ctx.set(name, value);
        }
      }, function() {
        done(null, true);
      });
    }

    if (step && next) {
      yield* next;
    }
  }

  Object.keys(middleware).forEach(key => {
    gen[key] = middleware[key];
  });

  return gen;
}

module.exports = function(app, options) {
  const clientCompiler = webpack(merge.smart(clientConfig, {
    entry: {
      main: ['webpack-hot-middleware/client', clientConfig.entry.main]
    },
    output: {
      filename: '[name].js'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  }));

  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  });

  app.use(convertDevMiddleware(devMiddleware));
  app.use(webpackHotMiddleware(clientCompiler));

  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem;
    const indexPath = path.resolve(clientConfig.output.path, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      options.indexHTMLUpdated(fs.readFileSync(indexPath, 'utf8'));
    }
  });

  const serverCompiler = webpack(serverConfig);
  const mfs = new MemoryFS();
  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    console.log(stats.toString({
      chunks: false,
      colors: true
    }));
    options.bundleUpdated(mfs.readFileSync(bundlePath, 'utf8'));
  });
}
