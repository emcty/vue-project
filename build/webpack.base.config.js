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
      'vue',
      'vue-resource',
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
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
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
              ? ['vue-style-loader', 'css-loader','postcss-loader']
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
        exclude: /node_modules/,
        use: DEBUG
            ? ['vue-style-loader','css-loader','postcss-loader']
            : ExtractTextPlugin.extract({
                use: 'css-loader?minimize',
                fallback: 'vue-style-loader'
              })
      }
    ]
  },
  plugins: DEBUG
    ? [
      new webpack.NamedModulesPlugin()
    ]
    : [
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        }
      }),
      new ExtractTextPlugin({
        filename: 'style-[chunkhash:10].css',
        allChunks: true
      })
    ]
}
