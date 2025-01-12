// filepath: /c:/Users/chanc/Documents/repotester/webpack.config.js
const path = require('path');

module.exports = {
  entry: './scripts/collegeFootballData.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
    },
  },
};