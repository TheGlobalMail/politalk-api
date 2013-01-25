var async = require('async');
var util = require('util');
var dates = require('./lib/dates');
var moment = require('moment');
var _ = require('lodash');
var db = require('./lib/db');
var csv = require('csv');
var wordchoices = require('wordchoices');

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
      cb(err);
    });

    var sql = "select * from hansards where major is null and minor is null and partied = true and date = $1 order by id";
    db.query(sql, [date], function(err, result){
      if (err) return cb(err);
      result.rows.forEach(function(row, done){
        var tokenData = wordchoices.extractTokenIndexes(row);
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
