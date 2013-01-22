var async = require('async');
var util = require('util');
var dates = require('./lib/dates');
var natural = require('natural');
var _ = require('lodash');
var extract = require('./lib/extract-wordchoices');
var db = require('./lib/db');
var moment = require('moment');
var offset = 0;
var batch = 1000;
var total;
var csv = require('csv');
var columns = ['word1', 'token1', 'word2', 'token2', 'word3', 'token3', 'date', 'party', 'hansard_id'];
var stopWords = require('./node_modules/gramophone/stopwords.json').sort();
var ignoreWords = require('./ignore.json').sort();
var ignoreWords = require('./ignore.json').sort();


dates.find(function(err, dates){
  if (err) throw err;

  async.forEachSeries(dates, function(date, cb){
    var formattedDate = moment(date).format('YYYY-MM-DD');
    var file = __dirname + '/wordchoices-data/tokenize_' + formattedDate + '.csv';
    var csvWriter = csv().to.path(file, {columns: columns});
    var start = new Date();
    csvWriter.on('close', function(){
      var end = new Date();
      var duration = moment.duration(end.getTime() - start.getTime()).humanize();
      console.error('completed ' + formattedDate + " in " + duration);
      cb(err);
    });

    var sql = "select * from hansards where major is null and minor is null and partied = true and date = $1 order by id";
    db.query(sql, [date], function(err, result){
      if (err) return cb(err);
      console.error('GOT ' + result.rowCount);
      result.rows.forEach(function(row, done){
        var tokenData = extractTerms2(row);
        _.each(tokenData, function(tokenDatum){
          csvWriter.write(tokenDatum);
        });
      });
      csvWriter.end();
    });
  }, function(err){
    db.end();
    if (err) console.error('ERROR: ' + err);
    if (!err) console.error('OK');
  });
});

function extractTerms2(row, cb){
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
          moment(row.date).format('YYYY-MM-DD'),
          row.party,
          row.id
        ]);
        var original = [originalTokens[index], originalTokens[index+1], originalTokens[index+2]];
        return notIgnoring(original[0]) && notAllStopWords(original) ? tokenData : null;
      })
      .compact()
      .value();
}

function notIgnoring(word){
  return _.indexOf(ignoreWords, word.toLowerCase(), true) === -1;
}

function notAllStopWords(words){
  return _.detect(_.compact(words), function(word){
    return _.indexOf(stopWords, word.toLowerCase(), true) === -1;
  });
}
