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

var cache = {};

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
  return isNaN(fromParam.valueOf()) ? defaultFrom : fromParm;
}

function getTo(param){
  var toParam = new Date(param);
  return isNaN(toParam.valueOf()) ? defaultTo : toParam;
}

app.get('/api/members', function(req, res, next){
  var from = getFrom(req.query.from);
  var to = getTo(req.query.to);
  var cacheKey = 'members-' + from.toString() + '-' + toString();
  var cached = cache[cacheKey];
  if (cached){
    return res.json(cached);
  }
  var query = "select sum(duration) as duration, speaker, speaker_id, party, " +
  "sum(case when (talktype='interjection') then 1 else 0 end) as interjections, " + 
  "sum(case when (talktype='speech') then 1 else 0 end) as speeches, " +
  "house, sum(words) as words, count(*) as total from hansards " + 
  "inner join member on member.member_id = speaker_id " +
  "where date between $1 and $2 " + 
  "group by speaker_id,speaker,party,house " + 
  "order by sum(duration) desc";

  db.query(query, [from, to], function(err, result) {
    var members;
    if (err) return next(err);
    members = result.rows;
    async.forEach(members, function(member, next){ 
      //var q = 'select date, 0 as duration from hansards group by date;'
      var q = 'select date, sum(case when (speaker_id=$1) then duration else 0 end) as duration from hansards group by date';
      db.query(q, [member.speaker_id], function(err, result) {
        if (err) return next(err);
        member.id = member.speaker_id;
        member.rank = members.indexOf(member) + 1;
        member.dates = _.map(result.rows, function(duration){
          return duration.date;
        }).join(',');
        member.durations = _.map(result.rows, function(duration){
          return Math.round(duration.duration * 100 / 60) / 100; 
        }).join(',');
        next(err);
      });
    }, function(err){
      if (err) return next(err);
      cache[cacheKey] = members;
      res.json(members);
    });
  });

});

app.get('/api/keywords', function(req, res, next){
  var query = "select text, sum(frequency) as frequency from phrases " + 
  "where date between $1 and $2 " + 
  "group by text order by frequency desc limit 50";

  db.query(query, [from(req.query.from), to(req.query.to)], function(err, result) {
    if (err) return next(err);
    res.json(result.rows);
  });
});

app.listen(process.env.PORT || 8080);
