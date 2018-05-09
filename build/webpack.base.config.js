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

// const filePath = DEBUG ? config.dev.publicPath : config.prod.publicPath;

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
  resolve: {
    extensions: ['.js', '.vue','.json'],
    modules: [
      path.resolve('./src'),
      path.resolve('node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          loaders: {
            css: DEBUG
              ? ['vue-style-loader', 'css-loader']
              : ExtractTextPlugin.extract({
                  use: 'css-loader?minimize',
                  fallback: 'vue-style-loader'
                })
          },
          postcss: [
            require('postcss-cssnext')({
              features: {
                autoprefixer: {
                  browsers: [
                    'last 3 versions',
                    '> 1% in CN',
                    'Firefox ESR',
                    'opera 12.1',
                    'ie >= 9',
                    'edge >= 12',
                    'safari >= 7'
                  ]
                }
              }
            })
          ]
        }
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(?:woff2?|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: DEBUG ? '[name].[ext]' : '[name]-[hash:10].[ext]'
        }
      },
      {
        test: /\.(?:png|jpe?g|gif)$/,
        loaders: DEBUG
          ? [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: '[name].[ext]'
                }
              }
            ]
          : [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: '[name]-[hash:10].[ext]'
                }
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  progressive: true,
                  optimizationLevel: 7,
                  interlaced: false,
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  }
                }
              }
            ]
      },
      {
        test: /.css$/,
        include: /node_modules/,
        use: DEBUG
            ? ['vue-style-loader', 'css-loader']
            : ExtractTextPlugin.extract({
                use: 'css-loader?minimize',
                fallback: 'vue-style-loader'
              })
      }
    ]
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new ExtractTextPlugin(`style-[chunkhash:10].css`, {
      allChunks: !DEBUG
    })
  ]
}
