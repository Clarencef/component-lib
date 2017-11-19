const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base.js');

module.exports = merge(base, {
  entry: [
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './',
    historyApiFallback: true
  }
});
