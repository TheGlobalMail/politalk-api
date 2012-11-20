require('nodetime').profile({
  accountKey: '1be0980981686c275b5a4c91ab8966df55d1d68d', 
  appName: 'politalk-api'
});
var express = require('express');
var app = express();
var web = process.argv[2] || 'dist';
var async = require('async');
var _ = require('lodash');
var db = require('./lib/db');
var dateUtils = require('date-utils');

var defaultTo = Date.today();
var defaultFrom = Date.today().addMonths(-3);

function authorize(username, password) {
  return 'tgm' === username && process.env.AUTHPASS === password;
}

var cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
};

app.configure(function(){
  app.use(cors);
  app.use(app.router);
  if (process.env.NODE_ENV === 'deliver'){
    app.use(express.basicAuth(authorize));
  }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function getFrom(param){
  var fromParam = new Date(param);
  return isNaN(fromParam.valueOf()) ? defaultFrom : fromParam;
}

function getTo(param){
  var toParam = new Date(param);
  return isNaN(toParam.valueOf()) ? defaultTo : toParam;
}

app.get('/api/members', function(req, res, next){
  var from = getFrom(req.query.from);
  var to = getTo(req.query.to);

  var query = "select sum(duration) as duration, speaker, first_name, " +
  "last_name, speaker_id, party, " +
  "sum(case when (talktype='interjection') then 1 else 0 end) as interjections, " + 
  "sum(case when (talktype='speech') then 1 else 0 end) as speeches, " +
  "house, sum(words) as words, count(*) as total from hansards " + 
  "inner join member on member.member_id = speaker_id " +
  "where date between $1 and $2 " + 
  "group by speaker_id,speaker,party,house,first_name,last_name " + 
  "order by sum(duration) desc";

  db.query(query, [from, to], function(err, result) {
    var members;
    if (err) return next(err);
    members = result.rows;
    _.each(members, function(member, index){
      member.id = member.speaker_id;
      member.rank = index + 1;
      member.dates = [];
      member.durations = [];
    });
    res.json(members);
  });

});

app.get('/api/keywords/data', function(req, res, next){
  var query = "select text, phrases.date, frequency, speaker, house, party from phrases " + 
    "inner join hansards on hansards.id = phrases.hansard_id " + 
    "inner join member on member.member_id = hansards.speaker_id " +
    "where phrases.date between $1 and $2 ";

  db.query(query, [getFrom(req.query.from), getTo(req.query.to)], function(err, result) {
    if (err) return next(err);
    res.json(result.rows);
  });
});

app.get('/api/keywords', function(req, res, next){
  var query = "select text, sum(frequency) as frequency from phrases " + 
  "where date between $1 and $2 " + 
  "group by text order by frequency desc limit 50";

  db.query(query, [getFrom(req.query.from), getTo(req.query.to)], function(err, result) {
    if (err) return next(err);
    res.json(result.rows);
  });
});

app.get('/api/dates', function(req, res, next){
  var query = "select date from hansards group by date order by date";

  db.query(query, function(err, result) {
    if (err) return next(err);
    res.json(_.pluck(result.rows, 'date'));
  });
});

module.exports.port = process.env.PORT || 8080;

module.exports.server = app.listen(module.exports.port);

