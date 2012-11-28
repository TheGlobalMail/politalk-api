var metrics = require('./lib/metrics');
var express = require('express');
var app = express();
var web = process.argv[2] || 'dist';
var async = require('async');
var _ = require('lodash');
var db = require('./lib/db');
var dateUtils = require('date-utils');

var defaultTo = Date.today();
var defaultFrom = new Date('2006-01-01');

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
  app.use(express.compress());
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
  var query;
  var values;

  if (!req.query.from && !req.query.to){
    query = "select * from member_summaries order by duration desc";
    values = [];
  }else{
    query = "select sum(duration) as duration, speaker, first_name, " +
      "last_name, speaker_id, person_id, party, " +
      "sum(case when (talktype='interjection') then 1 else 0 end) as interjections, " + 
      "sum(case when (talktype='speech') then 1 else 0 end) as speeches, " +
      "house, sum(words) as words, count(*) as total, image, entered_house, " +
      "left_house, left_reason from hansards " + 
      "inner join member on member.member_id = speaker_id " +
      "where date between $1 and $2 " + 
      "group by speaker_id,speaker,person_id,party,house,first_name,last_name,image, " + 
      "entered_house, left_house, left_reason " +
      "order by sum(duration) desc";
    values = [getFrom(req.query.from), getTo(req.query.to)];
  }

  db.query(query, values, function(err, result) {
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

app.get('/api/keywords', function(req, res, next){
  var query;
  var params = [getFrom(req.query.from), getTo(req.query.to)];
 
  if (req.query.house || req.query.party){
    query = "select text, sum(frequency) as frequency " +
      "from phrases_houses_summaries " + 
      "where date between $1 and $2 ";
    if (req.query.house){
      params.push(req.query.house);
      query += 'and house = $' + params.length + ' ';
    }
    if (req.query.party){
      params.push(req.query.party);
      query += 'and party = $' + params.length + ' ';
    }
  }else if (req.query.speaker_id){
    query = "select text, sum(frequency) as frequency " +
      "from phrases_speaker_ids_summaries " + 
      "where date between $1 and $2 ";
    params.push(req.query.speaker_id);
    query += 'and speaker_id = $' + params.length + ' ';
  }else if (req.query.person_id){
    query = "select text, sum(frequency) as frequency " +
      "from phrases_person_ids_summaries " + 
      "where date between $1 and $2 ";
    params.push(req.query.person_id);
    query += 'and person_id = $' + params.length + ' ';
  }else{
    query = "select text, sum(frequency) as frequency " +
      "from phrases_summaries " + 
      "where date between $1 and $2 ";
  }

  query += "group by text " +
    "order by frequency desc " +
    "limit 40";

  db.query(query, params, function(err, result) {
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

var server = module.exports = app.listen(process.env.PORT || 8080);
server.on('close', function(){
  db.end();
});
