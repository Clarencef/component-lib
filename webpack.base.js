const path = require("path");

module.exports = {
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    } , {
      test: /\.scss$/,
      loaders:["style-loader", "css-loader", "sass-loader"]
    }]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.jsx','.js','.scss'],
    alias: {
      components: path.resolve(__dirname,'lib'),
    },
  },
}