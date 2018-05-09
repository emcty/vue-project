'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const cssnext = require('postcss-cssnext');

const config = require('./config');

const DEBUG = process.env.NODE_ENV !== 'production';
const inputBase = config.inputBase;
const outputBase = config.outputBase;

const filename = `[name]${DEBUG ? '' : '-[hash:10]'}.[ext]`;

module.exports = {
  entry: {
    main: path.resolve(inputBase, 'main.js'),
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      'vue',
      'vue-router'
    ]
  },
  output: {
    path: path.resolve(outputBase),
    publicPath: DEBUG ? config.dev.publicPath : config.prod.publicPath,
    filename: '[name].[hash:10].js',
    chunkFilename: 'chunk.[id]-[chunkhash:10].js'
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
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', [
          `css${process.env.NODE_ENV === 'production' ? '?minimize' : ''}`,
          'postcss'
        ])
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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    new ExtractTextPlugin(`style-[chunkhash:10].css`, {
      allChunks: !DEBUG
    })
  ]
}
