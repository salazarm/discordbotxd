module.exports = {
  entry: {
    discord: './src/discord/install.js',
  },
  output: {
    library: 'lemmeinyouwilllose',
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
