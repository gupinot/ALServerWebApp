var path = require('path');
var express = require('express');
var appServer = require('./lib/api');

var app = express();

app.use('/api',appServer);
app.use('/', express.static('web'));

app.use(function(req, res, next){
  res.sendFile(path.join(__dirname, './web/index.html'));
});

app.listen(8080, '0.0.0.0', function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening at http://localhost:8080');
});
