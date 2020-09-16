const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ip = require('ip');
// eslint-disable-next-line import/no-extraneous-dependencies
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const baseConfig = require('./webpack.base');
const { getProjectPath } = require('./utils');

const HOST = process.env.HOST || ip.address() || 'localhost';
const PORT = 6061;

module.exports = merge(baseConfig(), {
  entry: getProjectPath('examples/index.tsx'),
  output: {
    pathinfo: true,
    futureEmitAssets: true,
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    // 相关配置文档：https://github.com/geowarin/friendly-errors-webpack-plugin
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `localhost运行链接: http://localhost:${PORT}\n`,
          `ip运行链接: http://${HOST}:${PORT}\n`
        ]
      },
      onErrors: null,
      clearConsole: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: getProjectPath('examples/index.html')
    })
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: true
  }
});
