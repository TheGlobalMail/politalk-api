var gramophone = require('gramophone');
var async = require('async');
var hansard = require('./lib/hansard');
var db = require('./lib/db');
var options = {from: 'html', to: 'keywords', html: true, score: true, stem: true, min: 1};

var offset = 0;
var batch = 1000;
var total;

var sql = "select count(id) from hansards where major is null and minor is null limit 30";
db.query(sql, function(err, result){
  total = result.rows[0].count; 
  async.whilst(
    function(){ return offset < total; },
    function(cb){
      var sql = "select * from hansards where major is null and minor is null order by date limit $2 offset $1";
      db.query(sql, [offset, batch], function(err, result){
        async.forEach(result.rows, function(row, done){
          hansard.extractKeywords(row.id, row.html, row.date, done);
        }, function(err){
          offset += batch;
          console.error('completed ' + offset);
          cb(err);
        });
      });
    }, function(err){
      db.end();
      console.error('ok');
    }
  );
});

