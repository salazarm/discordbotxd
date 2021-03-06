const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const WriteFilePlugin = require('write-file-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
  devtool: 'source-map',
  devServer: {
    hot: false,
    inline: false,
    https: true,
    port: 4000,
    clientLogLevel: 'none',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
    ],
  },
  plugins: [new WriteFilePlugin()],
})
