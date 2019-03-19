module.exports = {
  entry: {
    discord: ['babel-polyfill', './src/discord/install.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
}
