var db = require('./db');
var csv = require('csv');
var Stream = require('stream');
var util = require('util');
var moment = require('moment');
var async = require('async');
var es = require('event-stream');
var _ = require('lodash');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var hansard = require('./hansard');
var stopWords = require('../node_modules/gramophone/stopwords.json').sort();
var ignoreWords = require('../ignore.json').sort();
var columns = ['word1' , 'token1', 'word2', 'token2', 'word3', 'token3', 'hansard_id' ,'party', 'date'];

var wordchoices = exports;

exports.forTerm = function(term, fullMatch, cb){
  var tokens = _.compact(tokenizer.tokenize(term));
  var field = 'word';
  var conditions = _.map(tokens, function(t, i){
    return "lower(" + field + (i+1) + ") = lower($" + (i+1) + ")";
  });

  if (!fullMatch){
    field = 'token';
    tokens = _.map(tokens, function(token){
      return natural.PorterStemmer.stem(token);
    });
    conditions = _.map(tokens, function(t, i){ return field + (i+1) + " = $" + (i+1); });
  }

  if (_.isEmpty(tokens) || _.isEmpty(tokens[0])){
    return cb(null, []);
  }

  wordchoices.checkNotTooMany(conditions, tokens, function(err, tooMany){ 

    var tooManyMesssage = "The phrase " + term + " appears to be used too often. Perhaps try something more specific";
    if (err) return cb(err);
    if (tooMany) return cb(null, {tooMany: true, message: tooManyMesssage, data : []});

    var sql = "select party, week, " +
      "count(word1) as freq, string_agg(hansard_id, ',') as ids " + 
      " from wordchoice_tokens where " + 
      conditions.join(' and ') +
      " group by 1,2 order by 1,2";
    db.query(sql, tokens, function(err, result){
      if (err) return cb(err);
      cb(null, {data: result.rows});
    });

  });

};

exports.checkNotTooMany = function(conditions, tokens, cb){
  var sql = "select count(word1) as count  from wordchoice_tokens where " + 
    conditions.join(' and ') + " limit 10000";
  db.query(sql, tokens, function(err, result){
    if (err) return cb(err);
    cb(null, result.rows[0].count >= 10000);
  });
};

exports.createIndexStream = function(){
  return es.map(function(data, cb){
    hansard.byId(data.id, function(err, hansardRecord){
      if (err) return cb(err, data);

      // Skip records by speakers and skip headings
      if (!hansardRecord.partied || hansardRecord.major || hansardRecord.minor){
        return cb(null, data);
      }

      var indexes = exports.extractTokenIndexes(hansardRecord);

      async.forEach(indexes, insertIndex, function(err){
        cb(err, data);
      });
    });
  });
};

exports.extractTokenIndexes = function(row){
  var originalTokens = tokenizer.tokenize(row.stripped_html);
  var stemmedTokens = _.map(originalTokens, function(token){
    return natural.PorterStemmer.stem(token);
  });
  return _.chain(stemmedTokens)
      .map(function(token, index, tokens){
        var tokenData =_.object(columns, [
          originalTokens[index], 
          token, 
          originalTokens[index+1], 
          stemmedTokens[index+1], 
          originalTokens[index+2], 
          stemmedTokens[index+2],
          row.id,
          row.party,
          moment(row.date).format('YYYY-MM-DD')
        ]);
        var original = [originalTokens[index], originalTokens[index+1], originalTokens[index+2]];
        return notIgnoring(original[0]) && notAllStopWords(original) ? tokenData : null;
      })
      .compact()
      .value();
};

function notIgnoring(word){
  return _.indexOf(ignoreWords, word.toLowerCase(), true) === -1;
}

function notAllStopWords(words){
  return _.detect(_.compact(words), function(word){
    return _.indexOf(stopWords, word.toLowerCase(), true) === -1;
  });
}

function insertIndex(indexData, cb){
  var sql = "insert into wordchoice_tokens " +
    "(" + columns.join(',') + ") " +
    "values " +
    "(" + _.map(columns, function(f, i){ return "$" + (i + 1); }).join(',') + ")";
  var values = _.map(columns, function(f){ return indexData[f]; });
  db.query(sql, values, cb);
}
