const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'node',
  entry: ['./server/index.js', './node_modules/webpack/hot/poll?1000'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs',
  },
  externals: [/^[a-z]/],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        },
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
        query: {
          presets: ['env'],
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
};
