
'use strict';

module.exports = {
  title: '天天房东h5',
  inputBase: './src',
  outputBase: './dist',
  prod: {
    env: 'production',
    publicPath: '/',
    filePath: 'assets/'
  },
  dev: {
    env: 'development',
    publicPath: '/',
    filePath: '',
    port: 8091,
    proxyToServer: false,
    // serverUrl: 'http://10.106.40.55:8060',
    mock: {
      contentBase: './mock',
      port: 8092
    }
  }
}
