'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const DEBUG = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing';
const inputBase = 'src/';

let config = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"client"'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      inject: false,
      title: '开放平台',
      template: path.join(inputBase, 'index.html'),
      filename: '../dist/index.html',
      chunksSortMode: 'dependency',
      minify: DEBUG ? false : {
        collapseWhitespace: true,
        removeComments: false,
        minifyJS: true
      }
    })
  ]
});

if (!DEBUG) {
  config = merge(config, {
    vue: {
      loaders: {
        css: ExtractTextPlugin.extract('style', [`css?minimize}`, 'postcss'])
      }
    },
    plugins: [
      new ExtractTextPlugin('style-[chunkhash:10].css', {
        allChunks: true
      }),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        }
      }),
    ]
  });
}

module.exports = config;
