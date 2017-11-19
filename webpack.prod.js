const path = require("path");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const base = require('./webpack.base.js');

module.exports = merge(base, {
  entry: [
    path.join(__dirname, 'lib/index.js')
  ],
  output: {
    path: __dirname + '/build',
    filename: 'omg-component.js',
    library: 'omgComponent',
    libraryTarget: 'umd',
  },
  plugins: [
    new UglifyJSPlugin(),
    new CleanWebpackPlugin(['build']),
  ]
});
