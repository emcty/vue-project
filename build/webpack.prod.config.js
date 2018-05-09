
'use strict';

// 强制设置环境变量NODE_ENV为生产环境
process.env.NODE_ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = require('./config');
const webpackBaseConfig = require('./webpack.base.config');

/**
 * imagemin config
 * @type {Object}
 */
const imageWebpack = {
  progressive: true,
  optimizationLevel: 7,
  interlaced: false,
  pngquant: {
    quality: '65-90',
    speed: 4
  }
}

module.exports = merge.smart(webpackBaseConfig, {
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new CleanWebpackPlugin([config.outputBase], {
      root: path.resolve('./'),
      verbose: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(config.inputBase, 'index.html'),
      filename: 'index.html',
      chunksSortMode: 'dependency',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true
      }
    })
  ]
});
