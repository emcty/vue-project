'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const cssnext = require('postcss-cssnext');

const config = require('./config');

const debug = process.env.NODE_ENV !== 'production';
const inputBase = config.inputBase;
const outputBase = config.outputBase;

let filename = `[name]${debug ? '' : '-[hash:10]'}.[ext]`;
let chunkhash = debug ? '' : '-[chunkhash:10]';

let extractCSS = new ExtractTextPlugin(`style${chunkhash}.css`, {
  allChunks: !debug
});

module.exports = {
  entry: {
    main: [path.resolve(inputBase, 'main.js')],
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
    publicPath: debug ? config.dev.publicPath : config.prod.publicPath
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
      css: extractCSS.extract('style', [`css?${!debug ? '&minimize' : '&sourceMap'}`, 'postcss'])
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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CleanWebpackPlugin([config.outputBase], {
      root: path.resolve('./'),
      verbose: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),
    extractCSS
  ]
}
