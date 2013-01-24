var express = require('express');
var app = express();
var dir = __dirname; // + '/v1';
var port = process.env.PORT || 8090;

app.configure(function(){
  app.use(express.static(dir));
});

console.log('Serving ' + dir + ' on ' + port);
app.listen(port);
