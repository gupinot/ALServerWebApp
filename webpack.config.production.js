var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var now = new Date().getTime();
var env='production';
var appName = 'app.'+now;
var theme = process.env.THEME || 'default';

var roots = [
  path.join(__dirname, 'lib'),
  path.join(__dirname, 'env', env),
  path.join(__dirname, 'themes', theme)
];

module.exports = {
  entry: {
    [appName]: './lib/index.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/webapp/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      },
      '__DEVTOOLS__': false,
      'THEME': theme
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('app.'+now+'.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      title: 'Alstom ServerUsage',
      filename: 'index.html',
      publicPath: '/webapp',
      template: 'index.template.html',
      favicon: path.join(__dirname, 'assets/images/favicon.ico')
    })
  ],
  resolve: {
    root: roots
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!cssnext-loader') },
      { test: /\.js$/, loaders: ['babel'], include: roots },
      { test: /\.json$/, loaders: ['json'] },
      { test: /\.html$/, loaders: ['text'] },
      { test: /\.(ttf|eot|woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\/?public\/.*\./, loader: "file-loader?name=[path][name].[ext]?[hash]&context=./public/" }
    ]
  },
  cssnext: {
    browsers: 'last 2 versions'
  }
};
