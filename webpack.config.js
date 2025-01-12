const path = require('path');

module.exports = {
  entry: './scripts/main.js', // Update the entry point to your main script
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