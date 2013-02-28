var metrics = require('./lib/metrics');
var express = require('express');
var app = express();
var async = require('async');
var _ = require('lodash');
var db = require('./lib/db');
var cache = require('./lib/cache');
var members = require('./lib/members');
var hansard = require('./lib/hansard');
var keywords = require('./lib/keywords');
var wordchoices = require('./lib/wordchoices');
var dates = require('./lib/dates');
var JSONStream = require('JSONStream');
var jsonp = require('./lib/jsonp');
var server;

var KEYWORD_LIMIT = 5;


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
  app.use(express.bodyParser());
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

app.get('/api/members/year', function(req, res, next){
  var year = dates.getFrom(req.query.from);
  if (!year) res.json([]);
  members.findByYear(year, function(err, members){
    if (err) return next(err);
    res.json(members);
  });
});

app.get('/api/members', function(req, res, next){
  members.find(req.query.from, req.query.to, function(err, members){
    if (err) return next(err);
    jsonp.send(req, res, members);
  });
});

app.get('/api/keywords', function(req, res, next){
  keywords.find(req.query, function(err, keywords) {
    if (err) return next(err);
    jsonp.send(req, res, keywords);
  });
});

app.get('/api/dates', function(req, res, next){
  dates.find(function(err, dates) {
    if (err) return next(err);
    jsonp.send(req, res, dates);
  });
});

app.get('/api/weeks', function(req, res, next){
  dates.weeks(function(err, weeks) {
    if (err) return next(err);
    jsonp.send(req, res, weeks);
  });
});

if (process.env.ENABLE_WORDCHOICES || process.env.NODE_ENV === 'test'){
  app.get('/api/wordchoices/term/:term', function(req, res, next){
    var term = req.params.term && req.params.term.toLowerCase();
    var exactMatch = req.query.c;
    if (!term) return res.json([]);

    wordchoices.forTerm(term, exactMatch, function(err, results){
      if (err) return next(err);
      cache.cacheWordchoices(term, exactMatch, results, function(err){
        if (err) return next(err);
        jsonp.send(req, res, results);
      });
    });
  });

  app.all('/api/hansards', function(req, res, next){
    var ids = req.param('ids');
    if (!ids) return next('No ids supplied');
    var stream = hansard.createStream(ids);
    if (req.query.callback){
      res.set('content-type', 'application/javascript');
      res.write(req.query.callback + '([');
      var first = true;
      stream.on('data', function(record){
        var json = JSON.stringify(record);
        if (!first){
          json = ", " + json;
        }
        first = false;
        res.write(json);
      });
      stream.on('end', function(){
        res.write(']);');
        res.end(); 
      });
      stream.on('error', function(err){
        next(err);
      });
    }else{
      stream 
        .pipe(JSONStream.stringify())
        .pipe(res);
    }
  });

  app.get('/api/wordchoices/year/term/:term', function(req, res, next){
    var term = req.params.term && req.params.term.toLowerCase();
    var exactMatch = req.query.c;
    var party = req.query.party;
    if (!term) return res.json([]);

    wordchoices.forTermByYear(term, exactMatch, party, function(err, results){
      if (err) return next(err);
      jsonp.send(req, res, results);
    });
  });
}

module.exports = app;

if (!module.parent){
  server = app.listen(process.env.PORT || 8080);
  server.on('close', function(){
    db.end();
  });
}
