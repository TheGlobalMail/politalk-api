var db = require('./db');
var _ = require('lodash');
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
  // max three words
  var results;
  var tokens = _.compact(tokenizer.tokenize(term)).slice(0, 3);
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

  results = { 
    exact: !!fullMatch,
    tokens: tokens.join(' '),
    term: term,
    data: []
  };

  if (_.isEmpty(tokens) || _.isEmpty(tokens[0]) || tokens[0].length === 1 || !notIgnoring(tokens[0])){
    results.message =  "begins with a word that occurs too often for us to efficiently search. Please try a different search term";
    return cb(null, results);
  }

  wordchoices.checkNotTooMany(conditions, tokens, function(err, tooMany){ 

    var tooManyMesssage = "appears too often to display as a chart. Please try a different search term";
    if (err) return cb(err);
    if (tooMany){
      results.tooMany = true;
      results.message = tooManyMesssage;
      return cb(null, results);
    }

    var sql = "select party, week, " +
      "count(word1) as freq, string_agg(hansard_id, ',') as ids " + 
      " from " +
      lookupClusterTable(tokens[0]) +
      "where " + 
      conditions.join(' and ') +
      " group by 1,2 order by 1,2";
    db.readonlyQuery(sql, tokens, function(err, result){
      if (err) return cb(err);
      results.data = result.rows;
      cb(null, results);
    });

  });

};

exports.forTermByYear = function(term, exactMatch, party, cb){
  exports.forTerm(term, exactMatch, function(err, wordChoices){
    var forTermByYear = {};
    var years = ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];
    var aggregate = {};
    years.forEach(function(year){
      aggregate[year] = {count: 0, ids: []};
    });
    if (err) return cb(err);
    forTermByYear.exact = wordChoices.exact;
    forTermByYear.tokens = wordChoices.tokens;
    forTermByYear.party = party;
    forTermByYear.total = 0;
    wordChoices.data.forEach(function(datum){
      var year = datum.week.slice(0,4);
      var ids = datum.ids.split(',');
      if (!party || party === datum.party){
        aggregate[year].count += ids.length;
        forTermByYear.total += ids.length;
        aggregate[year].ids = aggregate[year].ids.concat(ids);
      }
    });
    forTermByYear.data = _.map(years, function(year){
      var subCounts = _.map(_.groupBy(aggregate[year].ids), function(values, id){
        return {id: id, count: values.length};
      });
      return {year: year, count: aggregate[year].count, ids: subCounts};
    });
    cb(null, forTermByYear);
  });
};

exports.checkNotTooMany = function(conditions, tokens, cb){
  var max = 43000;
  var sql = "select count(word1) as count  from " + 
    lookupClusterTable(tokens[0]) +
    "where " + 
    conditions.join(' and ') + " limit " + max;
  db.readonlyQuery(sql, tokens, function(err, result){
    if (err) return cb(err);
    cb(null, result.rows[0].count >= max);
  });
};

exports.createIndexStream = function(){
  return es.map(function(data, cb){
    hansard.byId(data.id, function(err, hansardRecord){
      if (err){
        if (process.env.VERBOSE){
          console.error("DOWNLOADER: createIndexStream err " + err);
        }
        return cb(err, data);
      }

      // Skip records by speakers and skip headings
      if (!hansardRecord.partied || hansardRecord.major || hansardRecord.minor){
        if (process.env.VERBOSE){
          console.error("DOWNLOADER: skipping " + hansardRecord.id);
        }
        return cb(null, data);
      }

      var indexes = exports.extractTokenIndexes(hansardRecord);
      if (process.env.VERBOSE){
        console.error("DOWNLOADER: Creating wordChoices index for " + hansardRecord.id);
      }

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
  var values = _.map(columns, function(f){ return indexData[f]; });
  if (!values[0] || values[0].length <= 1){
    return cb();
  }
  var sql = "insert into " + lookupClusterTable(values[0]) +
    "(" + columns.join(',') + ") " +
    "values " +
    "(" + _.map(columns, function(f, i){ return "$" + (i + 1); }).join(',') + ")";
  db.query(sql, values, cb);
}

function lookupClusterTable(token){
  return "wordchoice_tokens_cluster_" +
    (token.match(/^[a-z]{2}/i) ? token.slice(0,2) : 'nonalpha') + 
    " ";
}
