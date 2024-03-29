var path = require('path');
var express = require('express');
var webpack = require('webpack');
var fs = require('fs');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use('/public', express.static(__dirname + '/public'));

app.get('*', function (req, res) {
  console.log('Trap: ' + req.url);
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(3001, '0.0.0.0', function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening at http://localhost:3001');
});
