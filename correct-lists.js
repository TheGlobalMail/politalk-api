var db = require('./lib/db');
var _ = require('lodash');
var async = require('async');

var corrections = _.map(['phrases_list', 'phrases_party_list', 'phrases_speaker_ids_list'], function(table){
  return function(cb){ correctPhrasesList(table, cb); };
});

async.series(corrections, function(err){
  console.error('done');
  db.end();
  console.log(err);
});

function correctPhrasesList(table, cb){
  var query = 'select * from ' + table;
  console.error('doing ' + table);
  db.query(query, [], function(err, result) {
    if (err) return cb(err);
    async.forEachSeries(result.rows, function(row, next){
      var updatedNeeded = false;
      var data = JSON.parse(row.data);
      data.forEach(function(datum){
        if (datum.text.split(' ').length > 3 && datum.score && datum.frequency !== datum.score){
          console.error('updating ' + datum.text + ' from ' + datum.frequency + ' to ' + datum.score);
          datum.frequency = datum.score;
          updatedNeeded = true;
        }
      });
      if (updatedNeeded){
        console.error('updated need for ' + row.year);
        data = _.sortBy(data, 'frequency').reverse();
        var update = 'update ' + table + ' set data = $1 where year = $2 ';
        var params = [data, row.year];
        if (row.party){
          update += ' and party = $3 ';
          params.push(row.party);
        }
        if (row.speaker_id){
          update += ' and speaker_id = $3 ';
          params.push(row.speaker_id);
        }
        console.error('updating with ' + update);
        console.error(params);
        //db.query(update, params, next);
        next();
      }else{
        next();
      }
    }, cb);
  });
}
