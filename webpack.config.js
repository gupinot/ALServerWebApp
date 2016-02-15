var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var env = 'development';

var roots = [
  path.join(__dirname, 'lib'),
  path.join(__dirname, 'env', env),
];

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './lib/index'
  ],
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      },
      '__DEVTOOLS__': process.env.DEVTOOLS === 'true'
    }),
    new HtmlWebpackPlugin({
      title: 'Alstom ServerUsage',
      filename: 'index.html',
      template: 'index.template.html',
      favicon: path.join(__dirname, 'assets', 'images', 'favicon.ico')
    })
  ],
  resolve: {
    root: roots,
    moduleDirectories: [
      path.join(__dirname,'node_modules')
    ],
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!cssnext-loader' },
      { test: /\.js$/, loaders: ['babel'], include: roots, exclude: /node_modules/ },
      { test: /\.json$/, loaders: ['json'] },
      { test: /\.(ttf|eot|woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\/?public\/.*\./, loader: "file-loader?name=[path][name].[ext]?[hash]&context=public/" }
    ]
  },
  cssnext: {
    browsers: 'last 2 versions'
  }
};
