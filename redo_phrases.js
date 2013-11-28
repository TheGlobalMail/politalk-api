var async = require('async');
var db = require('./lib/db');
var hansard = require('./lib/hansard');
var moment = require('moment');

var offset = 0;
var batch = 20;
var total;

var sql = 'select count(id) from hansards where major is null and minor is null';
db.query(sql, function(err, result){
  total = result.rows[0].count;
  async.whilst(
    function(){ return offset < total; },
    function(cb){
      var start  = new Date();
      var sql = 'select * from hansards where major is null and minor is null order by date, id limit $2 offset $1';
      db.query(sql, [offset, batch], function(err, result){
        async.forEach(result.rows, function(row, cb){
          hansard.extractKeywordsWithFrequency1(row.id, row.html, db.formatDate(row.date), cb);
          cb();
        }, function(err){
          if (err) return cb(err);
          var end = new Date();
          var duration = moment.duration(end.getTime() - start.getTime()).humanize();
          console.error('Completed ' + offset + ' in ' + duration);
          offset += batch;
          cb();
        });
      });
    }, function(err){
      db.end();
      console.log(err ? 'error': 'ok');
    }
  );
});
