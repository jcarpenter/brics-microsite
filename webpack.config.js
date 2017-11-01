var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build/js/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  // https://webpack.github.io/docs/webpack-dev-server.html
  devServer: {
    contentBase: path.join(__dirname, "build"),
    publicPath: "/js",
    host: "0.0.0.0",
    port: 8080,
    inline: true,
    disableHostCheck: true
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
