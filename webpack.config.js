const path = require('path');

module.exports = {
  entry: './src/index.js', // The entry point for the application
  output: {
    filename: 'bundle.js', // The name of the output bundle
    path: path.resolve(__dirname, 'dist'), // The output directory
  },
  mode: 'development', // The mode in which Webpack will run (development or production)
  module: {
    rules: [
      {
        test: /\.css$/, // A regular expression to test for .css files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader for CSS files
      },
      {
        test: /\.(js|jsx)$/, // A regular expression to test for .js and .jsx files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: 'babel-loader', // Use Babel to transpile JavaScript files
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Use Babel presets for ES6+ and React
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      "fs": false, // Provide fallbacks for Node.js core modules
      "path": false,
      "os": false,
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // The directory to serve static files from
    compress: true, // Enable gzip compression
    port: 9000, // The port on which the dev server will run
  },
};