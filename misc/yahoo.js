var request = require('request');
var _ = require('lodash');
var _str = require('underscore.string');
var url = 'http://query.yahooapis.com/v1/public/yql'
var async = require('async');
var TRUNCATE_LENGTH = 500;
var OVERALL_TRUNCATE_LENGTH = 1000;
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

var mysql      = require('mysql');
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

function clearKeywords(cb){
  var query = 'update keywords set results_yahoo = null';
  connection.query(query, cb);
}

function generateKeywords(){

  clearKeywords(function(err){

    if (err) return complete(err);

    var query = 'select distinct(hdate) as extract from hansard where hdate is not null order by hdate';
    connection.query(query, function(err, dates, fields){
      async.forEach(dates, function(hansard, done){
        var date = hansard.extract;
        extractKeywordsForDate(date, function(err, text, results){
          if (err) return done(err);
          storeResults(date, text, results, done);
        });
      }, complete);
    });

  });
}

function extractKeywordsForDate(date, cb){

  var query = 'select hdate, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
    'where hdate = ? order by htime';

  connection.query(query, [date], function(err, sections, fields){
    var tokenized, text;

    if (err) return console.error(err);

    text = _.map(sections, function(section){
      var tokens = tokenizer.tokenize(_str.stripTags(section.body));
      return tokens.slice(0, TRUNCATE_LENGTH).join(' '); // truncate the text
    }).join("\n");

    yahoo(text, cb);

  });

}

function yahoo(text, cb){
  var params = {
    format: 'json',
    q: "select * from contentanalysis.analyze where text='" + text.replace(/['\[\]\$#]/g, '').substr(0, OVERALL_TRUNCATE_LENGTH) + "';"
  };

  request({method: 'POST', url: url, form: params}, function(err, res, body){
    var json;
    if (err){
      console.error(err);
    }else{
      json = JSON.parse(body);
      if (json.error){
        console.error(json.error.description);
      }else{
        console.error(json);
      }
      cb(null, text, body);
    }
  });
}

function storeResults(date, submitted, results, cb){
  var query = 'update keywords set results_yahoo = ? where extracted = ?';
  connection.query(query, [results, date], cb);
}
function complete(err){
  connection.end();
  if (err){
    console.error('error: ' + err);
  }else{
    console.error('ok');
  }
};

generateKeywords();
