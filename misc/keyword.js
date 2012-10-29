// generate single and ngrams
// also look for proper noun combos (multiple uppercase words appearing more
// than once)
// test tf and tfidf
// remove single words that occur in ngram

var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();
var NGrams = natural.NGrams;
var fs = require('fs');
var _ = require('lodash');
var request = require('request');
var _ = require('lodash');
var _str = require('underscore.string');
var async = require('async');
var mysql = require('mysql');
var connection;

var blacklist = [
  'acting prime minister',
  'madam',
  'no point',
  'project',
  'report',
  'australia',
  'deputy speaker',
  'supplementary question',
  'prime minister',
  'supplementary question',
  'the prime minister',
  'second reading',
  'australian',
  'deputy president',
  'a question',
  'reports',
  'deputy speaker',
  'legislation',
  'question time',
  'question',
  'bills',
  'yesterday',
  'legislastion',
  'document',
  'supplementary question',
  'the senator',
  'the bill ',
  'this afternoon',
  'resume',
  'the question',
  'first reading',
  'second reading',
  'third reading',
  'this day',
  'federal government ',
  'shadow minister',
  'question',
  'no doubt',
  'my friend',
  'both sides',
  '2012'
];

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

function blacklisted(term){
  if (term.match(/^\d+$/)){
    return true;
  }
  return _.indexOf(blacklist, term) !== -1;
}

function extractKeywordsForDate(date, cb){
  var query = 'select hdate, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
    'where hdate = ? order by htime';

  console.log('adding ' + date);

  connection.query(query, [date], function(err, sections, fields){
    var tokenized, text;

    if (err) return cb(err);

    text = _str.stripTags(_.pluck(sections, 'body').join(' '));

    tokenized = NGrams.bigrams(text);

    console.log('NGRAMS: ' + tokenized.length);

    tokenized = _.select(tokenized, function(bigram){
      return !_.detect(bigram, blacklisted);
    });

    console.log('NGRAMS after blacklist: ' + tokenized.length);

    cb();
  });

}

function extract(){
  var query = 'select distinct(hdate) as extract from hansard where hdate is not null order by hdate';
  connection.query(query, function(err, dates, fields){
    async.forEach(dates, function(hansard, done){
      var date = hansard.extract;
      extractKeywordsForDate(date, done);
    }, function(err){
      connection.end();
      if (err) return console.log('ERROR: ' + err);
      console.log('OK');
    });
  });
}

extract();
