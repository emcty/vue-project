'use strict';

const path = require('path');
const webpack = require('webpack');
const cssnext = require('postcss-cssnext');

const DEBUG = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing';
const inputBase = 'src/';
const outputBase = 'public/';
const filename = `[name]${DEBUG ? '' : '-[hash:10]'}.[ext]`;

module.exports = {
  entry: {
    main: path.resolve(inputBase, 'client-main.js'),
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      'vue',
      'vue-router',
      'vuex',
      'vuex-router-sync',
      'nprogress'
    ]
  },
  output: {
    path: path.resolve(outputBase),
    publicPath: '/assets/',
    filename: '[name].[chunkhash:10].js'
  },
  recordsPath: path.resolve('.webpack-records.json'),
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.(?:woff2?|eot|ttf)$/,
        loader: `file?name=${filename}`
      },
      {
        test: /\.(?:png|jpe?g|gif|svg)$/,
        loader: `url?limit=10000&name=${filename}`
      }
    ]
  },
  vue: {
    loaders: {
      css: 'postcss'
    },
    postcss: [
      cssnext({
        features: {
          autoprefixer: {
            browsers: ['last 3 versions', '> 1% in CN', 'Firefox ESR', 'opera 12.1', 'ie >= 9', 'edge >= 12', 'safari >= 7']
          }
        }
      })
    ]
  },
  resolve: {
    root: path.resolve(inputBase),
    extensions: ['', '.js', '.vue']
  }
}
