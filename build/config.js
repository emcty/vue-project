
'use strict';

module.exports = {
  inputBase: './src',
  outputBase: './dist',
  prod: {
    env: 'production',
    publicPath: '/assets/'
  },
  dev: {
    env: 'development',
    publicPath: '/',
    port: 8091,
    proxyToServer: false,
    // serverUrl: 'http://10.106.40.55:8060',
    mock: {
      contentBase: './mock',
      port: 8092
    }
  }
}
