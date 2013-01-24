var db = require('./db');
var csv = require('csv');
var Stream = require('stream');
var util = require('util');
var moment = require('moment');
var async = require('async');
var _ = require('lodash');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

var columns = ['date', 'party', 'keyword', 'count'];

var TOO_FREQUENCY = 8000;

exports.forTerm = function(term, cb){

  //parse query
  var tokens = tokenizer.tokenize(term);
  var stemmedTokens = _.chain(tokens)
    .map(function(token){
      return natural.PorterStemmer.stem(token);
    })
    .compact()
    .value();
  if (_.isEmpty(stemmedTokens) || _.isEmpty(stemmedTokens[0])){
    return cb(null, []);
  }

  var sql = "select party, week, " +
    "count(word1) as freq, string_agg(hansard_id, ',') as ids " + 
    "from wordchoice_tokens where " + 
    _.map(tokens, function(t, i){ return "token" + (i+1) + " = $" + (i+1); }).join(" and ") +
    " group by 1,2 order by 1,2";
  console.error(sql + " with " + stemmedTokens.join(','));
  db.query(sql, stemmedTokens, function(err, result){
    if (err) return cb(err);
    cb(null, result.rows);
  });
};

exports.createStream = function(keywords){
  //var query = "select id, date, party, html " +
  /*
  var query = "select id, date, html " +
    "from hansards " + //inner join member on member.member_id = hansards.speaker_id " +
    "where " +
    _.map(keywords, function(keyword){
      return " (searchable @@ to_tsquery('''" +  keyword.replace("'", '') + "''')) ";
    }).join(' or ' );
  */
  var query = "select date, party, sum(CountInString(html, $1)) as count " +
    "from hansards " + //inner join member on member.member_id = hansards.speaker_id " +
    "where searchable @@ to_tsquery('" +
    _.map(keywords, function(keyword){
      return "''" + keyword + "''";
    }).join(' | ')  + "') " +
    "group by date, party";
    
  var resultStream = new Stream();
  resultStream.readable = true;
  db.query(query, [keywords[0]], function(err, result){
    if (err) throw err;
    result.rows.forEach(function(row, done){
      keywords.forEach(function(keyword){
        var count = row.html && row.html.match(new RegExp(keyword, "igm"));
        var datum = {};
        if (count){
          datum.keyword = keyword;
          datum.date = moment(row.date).format('YYYY-MM-DD');
          datum.count = count ? count.length : 0;
          //datum.party = row.party;
          datum.id = row.id;
          resultStream.emit('data', datum);
        }
      });
    });
    db.end();
    resultStream.emit('end');
  });
  return resultStream;
};

/*
exports.createStream = function(){
  var resultStream = new Stream();
  resultStream.readable = true;
  db.query(query, function(err, result){
    if (err) throw err;
    async.forEach(result.rows, function(row, done){
      async.forEach(keywords, function(keyword, doneKeyword){
        var count = row.html && row.html.match(new RegExp(keyword, "igm"));
        var phrasesQuery = 'select text, sum(frequency) as frequency from phrases ' +
          'where hansard_id in ($1) group by text order by sum(frequency) desc limit 30';

        db.query(phrasesQuery, [row.ids], function(err, results){
          if (err) return doneKeyword(err);
          var datum = {};
          datum.keyword = keyword;
          datum.date = moment(row.date).format('YYYY-MM-DD');
          datum.count = count ? count.length : 0;
          //datum.party = row.party;
          datum.ids = row.ids.split(',');
          datum.keywords = _.map(results.rows, function(keyword){
            return {text: keyword.text, frequency: keyword.frequency};
          });
          resultStream.emit('data', datum);
          doneKeyword();
        });
      }, done);
    }, function(err){
      if (err) return resultStream.emit('error', err);
      db.end();
      resultStream.emit('end');
    });
  });
  return resultStream;
};
*/

/*
exports.createCSVStream = function(){
  var csvWriter = csv({columns: columns}); //.to.path(__dirname+'/data/asylum_seekers.csv');
  csvWriter.on('end', function(){
    db.end();
  });
  db.query(query, function(err, result){
    if (err) throw err;
    result.rows.forEach(function(row){
      keywords.forEach(function(keyword){
        var count = row.html && row.html.match(new RegExp(keyword, "igm"));
        var datum = {};
        datum.keyword = keyword;
        datum.date = moment(row.date).format('YYYY-MM-DD');
        datum.count = count ? count.length : 0;
        datum.party = row.party;
        csvWriter.write(datum);
      });
    });
    db.end();
    csvWriter.end();
  });
  return csvWriter;
};
*/
