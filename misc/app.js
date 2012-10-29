
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var mysql      = require('mysql');
var async = require('async');
var _ = require('lodash');
var connection;

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

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Compatible

// Now less files with @import 'whatever.less' will work(https://github.com/senchalabs/connect/pull/174)
var TWITTER_BOOTSTRAP_PATH = './vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn){
  try {
    var less = require('less');var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
  } catch (err) {fn(err);}
}

// Routes
app.get('/', function(req, res, next){
  res.render('index');
});

app.get('/people', function(req, res, next){
  var query = "select sum(duration) as duration, member.member_id, member.first_name, member.last_name, speaker_id, party, sum(if(talk='interjection', 1, 0)) as interjections, member.house, count(*) as total from hansard " + 
   " inner join member on member.member_id = speaker_id group by speaker_id order by sum(duration) desc";
  connection.query(query, function(err, members, fields) {
    async.forEach(members, function(member, next){ 
      var q = 'select hansard.hdate, sum(if(speaker_id = ?, duration, 0)) as duration from hansard group by hansard.hdate;'
      connection.query(q, member.member_id, function(err, durations, fields) {
        if (err) return next(err);
        member.durations = _.map(durations, function(duration){
          return Math.round(duration.duration * 100 / 60) / 100; 
        }).join(',');
        next(err);
      });
    }, function(err){
      if (err) return next(err);
      res.render('people', {members: members});
    });
  });

});

app.get('/topics/motion', function(req, res, next){
  res.render('topics-vis');
});

app.get('/topics.csv', function(req, res, next){
  var query = "select topics.name as topic, hdate, sum(duration) as duration, count(*) as total  from hansard " + 
   " inner join topics on topics.id = topic_id group by hdate, topics.id order by sum(duration) desc";
  connection.query(query, function(err, data, fields) {
    var csv = "Topic,Date,Duration,Total\n";
    csv += _.map(data, function(datum){
      var date = datum.hdate.getFullYear() + '-' + (datum.hdate.getMonth() + 1) + '-' + datum.hdate.getDate();
      return [datum.topic, date, datum.duration, datum.total].join(',');
    }).join("\n");
    res.send(csv, { 'Content-Type': 'text/plain' }, 201);
  });
});

app.get('/topics', function(req, res, next){
  var query = "select sum(duration) as duration, topics.*, count(*) as total,  sum(if(talk='interjection', 1, 0)) as interjections from hansard " + 
   " inner join topics on topics.id = topic_id group by topics.id order by sum(duration) desc";
  connection.query(query, function(err, topics, fields) {
    async.forEach(topics, function(topic, next){ 
      var q = 'select hansard.hdate, sum(if(topic_id = ?, duration, 0)) as duration from hansard group by hansard.hdate;'
      connection.query(q, [topic.id], function(err, durations, fields) {
        if (err) return next(err);
        topic.durations = _.map(durations, function(duration){
          return Math.round(duration.duration * 100 / 60) / 100; 
        }).join(',');
        next(err);
      });
    }, function(err){
      if (err) return next(err);
      res.render('topics', {topics: topics});
    });
  });

});

app.get('/members/:id', function(req, res, next){
  var memberSql = "select * from member where member_id = ?";
  var speechesSql = "select *, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id where speaker_id = ? order by hdate desc, htime";
  connection.query(memberSql, [req.param('id')], function(err, members, fields) {
    if (err) return next(err);
    connection.query(speechesSql, [req.param('id')], function(err, speeches, fields) {
      if (err) return next(err);
      res.render('member', {speeches: speeches, member: members[0]});
    });
  });
});

app.get('/topics/:id', function(req, res, next){
  var topicSql = "select * from topics where id = ?";
  var speechesSql = "select hansard.*, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id where topic_id = ? and subsection_id <> 0 order by hdate desc, htime";
  connection.query(topicSql, [req.param('id')], function(err, topics, fields) {
    if (err) return next(err);
    connection.query(speechesSql, [req.param('id')], function(err, speeches, fields) {
      if (err) return next(err);
      res.render('topic', {speeches: speeches, topic: topics[0]});
    });
  });
});

app.get('/keywords/month', function(req, res, next){
  var query = "select * from keywords order by extracted desc";
  connection.query(query, function(err, keywords, fields) {
    var currentMonth = null;
    var keywords_by_month = [];
    var currentMonthKeywords;
    if (err) return next(err);
    _.forEach(keywords, function(keyword){
      if (!currentMonth || currentMonth.getMonth() !== keyword.extracted.getMonth()){
        if (currentMonth){
          keywords_by_month.push({ 
            month: currentMonth,
            terms: currentMonthKeywords
          });
        }
        currentMonth = keyword.extracted;
        currentMonthKeywords = [];
      }
      currentMonthKeywords.push(JSON.parse(keyword.results).keywords);
    });
    if (currentMonth){
      keywords_by_month.push({ 
        month: currentMonth,
        terms: currentMonthKeywords
      });
    }
    _.forEach(keywords_by_month, function(keywords_for_month){
      var averagedKeywords = {};
      _.each(_.flatten(keywords_for_month.terms), function(term){
        var relevance = parseFloat(term.relevance);
        if (averagedKeywords[term.text]){
          averagedKeywords[term.text].count += 1;
          averagedKeywords[term.text].total += relevance;
        }else{
          averagedKeywords[term.text] = {count: 1, total: relevance};
        }
      });
      keywords_for_month.averages =  _.chain(averagedKeywords)
        .pairs()
        .map(function(avg){ return {term: avg[0], average: avg[1].total}; }) // / avg.count
        .sortBy(function(avg){ return avg.average })
        .reverse()
        .map(function(avg){ return avg.term + ' (' + avg.average + ')'; })
        .value()
        .slice(0, 50)
        .join(', ');
    });
    res.render('keywords_by_month', {keywords: keywords_by_month});
  });
});

app.get('/keywords', function(req, res, next){
  var query = "select * from keywords order by extracted desc";
  connection.query(query, function(err, keywords, fields) {
    if (err) return next(err);
    _.forEach(keywords, function(keyword){
      var yahooResults;
      keyword.keywords = _.map(JSON.parse(keyword.results).keywords, function(keyword){
        return keyword.text;
      }).join(', ');
      yahooResults = JSON.parse(keyword.results_yahoo);
      if (yahooResults.query.results){
        keyword.keywords_yahoo = _.map(yahooResults.query.results.entities.entity, function(keyword){
          return keyword.text.content;
        }).join(', ');
      }else{
        keyword.keywords_yahoo = ''; 
      }
      _.each([1, 2, 3, 4], function(ngram){
        keyword['keywords_natural_' + ngram]  = _.map(JSON.parse(keyword['results_natural_' + ngram]), function(keyword){
          return keyword.term + ' (' + keyword.tf + ')';
        }).join(', ');
      });
      keyword['keywords_natural_combo']  = _.map(JSON.parse(keyword['results_natural_combo']), function(keyword){
        return keyword.term + ' (' + keyword.tf + ')';
      }).join(', ');
    });
    res.render('keywords', {keywords: keywords});
  });
});

app.get('/classifications', function(req, res, next){
  var date = req.param('date') ? new Date(req.param('date')) : new Date(2012, 9, 11);
  var query = 'select hdate, htime, body, topics.name as topic, hansard.epobject_id from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
    'inner join topics on topics.id = hansard.topic_id ' + 
    'where section_id <> 0 and subsection_id = 0 and hdate = ? order by htime'
  connection.query(query, [date], function(err, subsections, fields) {
    if (err) return next(err);
    res.render('classifications', {subsections: subsections});
  });
});

app.post('/categories', function(req, res, next){
  var updateCategories = function(){
  };
  if (req.body.category && req.body.keywords){
    // insert and then call updateCategories
  }else{
    updateCategories();
  }
});

app.post('/classify', function(req, res, next){
  var query = 'select * from topics order by id desc';
  connection.query(query, function(err, topics, fields) {
    if (err) return next(err);

    // reset topics
    var q = 'update hansard set topic_id = 1 where section_id <> 0 and subsection_id = 0';
    connection.query(q, function(err) {
      if (err) return next(err);

      async.forEach(topics, function(topic, done){ 

        var q = 'update hansard ' + 
          'inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
          'set topic_id = ? ' +
          "where body rlike '" + topic.keywords.split(',').join('|') + "' " +
          'and section_id <> 0 and subsection_id = 0';

        if (!topic.keywords) return done();

        connection.query(q, [topic.id], function(err) {
          done(err);
        });

      }, function(err){
        if (err) return next(err);

        // Update all speeches to have the same topic id as the subsection
        // they're in
        var q = "update hansard inner join hansard subsections on hansard.subsection_id = subsections.epobject_id " + 
          "set hansard.topic_id = subsections.topic_id";
        connection.query(q, function(err) {
          if (err) return next(err);
          res.redirect('/classifications');
        });
      });
    });
  });
});

app.get('/sections/:id/speeches', function(req, res, next){
  var query = 'select hansard.*, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
    'where hansard.epobject_id = ?'
  connection.query(query, [req.param('id')], function(err, subsections, fields) {
    if (err) return next(err);
    query = 'select hansard.*, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
      'where subsection_id = ?'
    connection.query(query, [req.param('id')], function(err, speeches, fields) {
      if (err) return next(err);
      res.render('speeches', {speeches: speeches, subsection: subsections[0]});
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
