var util = require('util');
var natural = require('natural'),
    TfIdf = natural.TfIdf;
var NGrams = natural.NGrams;
var fs = require('fs');
var _ = require('lodash');
var request = require('request');
var _ = require('lodash');
var _str = require('underscore.string');
var async = require('async');
var keywords = require('./keywords');


var blacklist = [
  'acting prime minister',
  'pty',
  'http',
  'ltd',
  'tabling',
  'special',
  'electorate',
  'madam',
  'no point',
  'project',
  'report',
  'australia',
  'deputy speaker',
  'documents',
  'supplementary question',
  'prime minister',
  'supplementary question',
  'the prime minister',
  'second reading',
  'australian',
  'australians',
  'deputy president',
  'a question',
  'reports',
  'deputy speaker',
  'legislation',
  'question time',
  'question',
  'questions',
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
  'reading',
  'no doubt',
  'my friend',
  'both sides',
  '2012'
];

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
  var query = 'update keywords set results_natural = null';
  connection.query(query, cb);
}

function generateKeywords(){

  var ngrams = [1, 2, 3, 4]

  blacklist = blacklist.concat(fs.readFileSync('stopwords.txt').toString().split('\n'));

  clearKeywords(function(err){

    if (err) return complete(err);

    var query = 'select distinct(hdate) as extract from hansard where hdate is not null order by hdate';
    connection.query(query, function(err, dates, fields){
      async.forEach(dates, function(hansard, dateComplete){
        var date = hansard.extract;
        async.map(ngrams, function(ngram, ngramComplete){
          var tfidf = new TfIdf();
          addDocumentForDateWithNgram(date, ngram, tfidf, function(err){
            if (err) return ngramComplete(err);
            calculateResults(date, ngram, tfidf, ngramComplete);
          });
        }, function(err, results){
          if (err) return dateComplete(err);
          combineResultsForDate(date, results, dateComplete);
        });
      }, complete);
    });

  });
}

function combineResultsForDate(date, results, cb){
  var combinedResults = {}, combined;
  
  // remove the results for the single word phrases
  _.each(_.flatten(results.slice(1)), function(result){
    combinedResults[result.term] = result.tf;
  });

  // Combine keyword results intelligently
  combined = keywords.combine(combinedResults, 0.5);

  // Convert to term: tf: format and sort
  combined = _.chain(combined) 
    .pairs()
    .sortBy(_.last)
    .reverse()
    .map(function(combination){ return {term: combination[0], tf: combination[1] }; })
    .value();

  var query = 'update keywords set results_natural_combo = ? where extracted = ?';
  connection.query(query, [JSON.stringify(combined), date], cb);
};

function addDocumentForDateWithNgram(date, ngram, tfidf, cb){

  var query = 'select hdate, body from hansard inner join epobject on epobject.epobject_id = hansard.epobject_id ' +
    'where hdate = ? order by htime';

  connection.query(query, [date], function(err, sections, fields){
    var tokenized, text;

    if (err) return cb(err);

    text = _str.stripTags(_.pluck(sections, 'body').join(' '));

    tokenized = NGrams.ngrams(text, ngram);

    tokenized = _.map(tokenized, function(ngram){ return ngram.join(' ').toLowerCase(); });

    // add document to
    tfidf.addDocument(tokenized);
    cb();
  });

}

function blacklisted(term){
  if (term.match(/^\d+$/)){
    return true;
  }
  return _.indexOf(blacklist, term.toLowerCase()) !== -1;
}


function calculateResults(date, ngram, tfidf, cb){
  var results = [];

  list = tfidf.listMostFrequestTerms(0);

  // reject ngram where any word is in stoplist
  list = _.select(list, function(item){
    return keywords.whitelisted(item.term) || 
      !_.detect(item.term.split(' '), blacklisted);
  });

  // return top 40
  results = list.slice(0, 40);

  // store results
  storeResults(date, ngram, JSON.stringify(results), function(err){
    if (err) return cb(err);
    cb(null, results);
  }); 
}

function storeResults(date, ngram, results, cb){
  var query = 'update keywords set results_natural_' + ngram + ' = ? where extracted = ?';
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

