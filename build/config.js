
'use strict';

module.exports = {
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
    mock: {
      contentBase: './mock',
      port: 8092
    }
  }
}
