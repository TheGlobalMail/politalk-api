var express = require('express')
var app = express();
var web = process.argv[2] || 'dist';
var async = require('async');
var _ = require('lodash');
var mysql      = require('mysql');

// Silly little cache to speed up development until I refine api
var cache = {};

function authorize(username, password) {
  return 'tgm' === username && process.env.AUTHPASS === password;
}

var cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
}

app.configure(function(){
  app.use(cors);
  app.use(app.router);
  if (process.env.NODE_ENV === 'deliver'){
    app.use(express.basicAuth(authorize));
  }
  if (['staging', 'production'].indexOf(process.env.NODE_ENV) < 0){
    app.use(express.static(__dirname + '/' + web));
  }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

if (process.env.DATABASE_URL){
  connection = mysql.createConnection(process.env.DATABASE_URL);
}else{
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'openaustralia'
  });
}
connection.connect();

app.get('/api/members', function(req, res, next){
  var query = "select sum(duration) as duration, member.member_id, member.first_name, member.last_name, speaker_id, party, " +
  "sum(if(talk='interjection', 1, 0)) as interjections, member.house, count(*) as total from hansard" + 
  " inner join member on member.member_id = speaker_id group by speaker_id order by sum(duration) desc";

  if (cache.members){
    console.log('using cached members...');
    return res.json(cache.members);
  }

  connection.query(query, function(err, members, fields) {
    async.forEach(members, function(member, next){ 
      var q = 'select hansard.hdate, sum(if(speaker_id = ?, duration, 0)) as duration from hansard group by hansard.hdate;'
      connection.query(q, member.member_id, function(err, durations, fields) {
        if (err) return next(err);
        member.id = member.member_id;
        member.rank = members.indexOf(member) + 1;
        member.durations = _.map(durations, function(duration){
          return Math.round(duration.duration * 100 / 60) / 100; 
        }).join(',');
        next(err);
      });
    }, function(err){
      if (err) return next(err);
      cache.members = members;
      res.json(members);
    });
  });

});

app.get('/api/keywords', function(req, res, next){
  var query = "select * from keywords order by extracted desc";

  if (cache.keywords){
    console.log('using cached keywords...');
    return res.json(cache.keywords);
  }

  connection.query(query, function(err, keywords, fields) {
    if (err) return next(err);
    _.forEach(keywords, function(keyword){
      keyword.keywords = _.map(JSON.parse(keyword['results_natural_combo']), function(keyword){
        return keyword.term + ' (' + keyword.tf + ')';
      }).join(', ');
    });
    cache.keywords = keywords;
    res.json(keywords);
  });
});

app.listen(process.env.PORT || 8080);
