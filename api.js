var metrics = require('./lib/metrics');
var express = require('express');
var app = express();
var web = process.argv[2] || 'dist';
var async = require('async');
var _ = require('lodash');
var db = require('./lib/db');
var cache = require('./lib/cache');
var members = require('./lib/members');
var keywords = require('./lib/keywords');
var wordchoices = require('./lib/wordchoices');
var dates = require('./lib/dates');
var JSONStream = require('JSONStream');
var server;


function authorize(username, password) {
  return 'tgm' === username && process.env.AUTHPASS === password;
}

var cors = function(req, res, next) {
  res.header('Cache-Control', 'max-age=300');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Expose-Headers', 'If-None-Match,Etag');
  res.header('Access-Control-Max-Age', '36000');
  next();
};

app.configure(function(){
  app.use(express.responseTime()); 
  app.use(cors);
  app.use(express.compress());
  app.use(cache.middleware());
  app.use(app.router);
  if (metrics.nodetime){
    app.use(metrics.nodetime.expressErrorHandler());
  }
  app.use(express.errorHandler()); 
  if (process.env.NODE_ENV === 'deliver'){
    app.use(express.basicAuth(authorize));
  }
});

app.get('/api/members', function(req, res, next){
  members.find(req.query.from, req.query.to, function(err, members){
    if (err) return next(err);
    res.json(members);
  });
});

app.get('/api/keywords', function(req, res, next){
  keywords.find(req.query, function(err, keywords) {
    if (err) return next(err);
    res.json(keywords);
  });
});

app.get('/api/dates', function(req, res, next){
  dates.find(function(err, dates) {
    if (err) return next(err);
    res.json(dates);
  });
});

app.get('/api/wordchoices/asylum.csv', function(req, res, next){
  var stream = wordchoices.createCSVStream();
  stream.pipe(res);
});

app.get('/api/wordchoices/asylum', function(req, res, next){
  var stream = wordchoices.createStream();
  stream.pipe(JSONStream.stringify()).pipe(res);
});

app.get('/api/hansards', function(req, res, next){
  var ids = _.map(req.query.ids, function(q){
      return "'" + q + "'";
    }).join(',');
  var sql = 'select * from hansards inner join member on member.member_id = hansards.speaker_id where id in (' + 
    ids + ') order by date, time';
  if (!ids) return res.json([]);
  db.query(sql, function(err, result){
    res.json(result.rows);
  });
});

app.get('/api/die', function(req, res, next){
  sdfsd();
});

module.exports = app;

if (!module.parent){
  server = app.listen(process.env.PORT || 8080);
  server.on('close', function(){
    db.end();
  });
}
