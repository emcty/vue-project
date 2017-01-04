'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const pkg = require('../package.json');
const baseConfig  = require('./webpack.base.config');
const inputBase = 'src/';
const outputBase = 'dist/';

let config = merge(baseConfig, {
  target: 'node',
  entry: path.resolve(inputBase, 'server-main.js'),
  output: {
    path: path.resolve(outputBase),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: Object.keys(pkg.dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    })
  ]
});

module.exports = config;
