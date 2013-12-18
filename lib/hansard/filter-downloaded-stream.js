var db = require('../db');
var Stream = require('stream');
var moment = require('moment');
var util = require('util');

module.exports = function filterDownloadedStream(){
  var stream = new Stream();
  stream.writable = stream.readable = true;
  stream.alreadyDownloaded = {};
  stream.dataToCheck = [];
  stream.ended = false;
  stream.checkedHansards = false;
  stream._keyFor = function(house, date){
    return [house, moment(date).format('YYYY-MM-DD')].join('-');
  };
  stream._start = function(){
    // load all the house/data combos from hansard
    var sql = 'select left(id, 1) as house, date from hansards group by left(id, 1), date order by left(id, 1), date';
    db.query(sql, [], function(err, result){
      if (err) return stream.emit('error', err);
      result.rows.forEach(function(row){
        var house = row.house === 's' ? 'senate' : 'house';
        stream.alreadyDownloaded[stream._keyFor(house, row.date)] = true;
      });
      stream.checkedHansards = true;
      if (stream.ended) stream._resolveDownloaded();
    });
  };

  stream.write = function(data){
    stream.dataToCheck.push(data);
  };

  stream.end = function(data){
    if (data) stream.write(data);
    stream.ended = true;
    if (stream.checkedHansards) stream._resolveDownloaded();
  };

  stream._resolveDownloaded = function(){
    if (process.env.VERBOSE) console.error('Filter: examining ' + stream.dataToCheck.length + ' data');
    stream.dataToCheck.forEach(function(datum){
      var house = datum.house.match(/senate/) ? 'senate' : 'house';
      if (!stream.alreadyDownloaded[stream._keyFor(house, datum.date)]){
        if (process.env.VERBOSE) console.error('Passed filter: ' + datum.url);
        stream.emit('data', datum);
      }
    });
    stream.emit('close');
  };

  process.nextTick(stream._start);
  return stream;
};

