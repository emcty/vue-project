'use strict';
process.env.NODE_ENV = 'development';

const path = require('path');
const WebpackDevServer = require("webpack-dev-server");
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');
const chalk = require("chalk");

const config = require('./config');
const inputBase = config.inputBase;
const port = config.dev.port;
const mockPort = config.dev.mock.port;

process.noDeprecation = true;

let compiler = webpack(merge.smart(webpackBaseConfig, {
  entry: {
    app: [
      'webpack-dev-server/client?/',
      'webpack/hot/only-dev-server'
    ]
  },
  cache: true,
  devtool: 'cheap-module-inline-source-map',
  plugins: [
    
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest'],
      minChunks: Infinity
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(config.inputBase, 'index.html'),
      filename: 'index.html'
    })
  ]
}));

const server = new WebpackDevServer(compiler, {
  historyApiFallback: {
    index: '/'
  },
  hot: true,
  compress: true,
  stats: {
    colors: true,
    chunks: false,
    children: false
  },
  proxy: {
    '/api/*': {
      target: `http://localhost:${mockPort}/`,
      secure: false
    },
    '/ajax/*': {
      target: config.dev.proxyToServer ? config.dev.serverUrl : `http://localhost:${mockPort}/`,
      secure: false
    }
  }
});

server.listen(port, '0.0.0.0', function(err) {
  if (err) {
    console.error(chalk.red(err));
    return;
  }

  console.log(chalk.green(`\nWebpack dev server listening at http://localhost:${port}\n`));
});
