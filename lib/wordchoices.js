var db = require('./db');
var csv = require('csv');
var Stream = require('stream');
var util = require('util');
var moment = require('moment');
var async = require('async');
var _ = require('lodash');

var keywords = [
  'asylum seeker',
  'boat people',
  'illegals',
  'refugee'
];

var query = "select date, party, string_agg(html, ' ') as html, string_agg(id, ',') as ids from hansards inner join member on member.member_id = hansards.speaker_id where html ~* '(" + keywords.join('|') + ")' group by date, party order by date, party;";
var columns = ['date', 'party', 'keyword', 'count'];

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
          datum.party = row.party;
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
