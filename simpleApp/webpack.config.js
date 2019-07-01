const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// const nodeExternals = require('webpack-node-externals');

console.log(__dirname);

module.exports = {
  entry: { main: './simpleApp/main.js'},
  target: 'web',
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    contentBase: __dirname,
    compress: true,
    http2: true,
    port: 8080
  },
  // externals: [nodeExternals()],
  output: {
    // path: path.resolve(__dirname, 'dist'),
    path: __dirname,

    filename: 'app.bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [{
      // Include ts, tsx, js, and jsx files.
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  // plugins: [new HtmlWebpackPlugin]
};
