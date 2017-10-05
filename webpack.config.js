const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: './client/Client.js',
    vendor: [
      'react', 'react-dom', 'react-router-dom', 'reactstrap', 'react-router-bootstrap',
      'babel-polyfill', 'react-select',
    ],
  },
  output: {
    path: path.resolve(__dirname, './static'),
    filename: 'app.bundle.js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'stage-2', 'react'],
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    port: 8000,
    contentBase: 'static',
    historyApiFallback: true,
  },
  devtool: 'source-map',
};
