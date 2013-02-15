var async = require('async');
var db = require('./lib/db');
var shards = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; //, 'nonalpha'];

var offset = 0;
var batch = 1000;
var total;

duplicates = {};

var sql = "select count(id) from hansards where major is null and minor is null and date > '2006-01-01' and date < '2014-01-01'";
db.query(sql, function(err, result){
  total = result.rows[0].count; 
  async.whilst(
    function(){ return offset < total; },
    function(cb){
      var sql = "select * from hansards where major is null and minor is null and date > '2006-01-01' and date < '2014-01-01' order by date limit $2 offset $1";
      db.query(sql, [offset, batch], function(err, result){
        async.forEachSeries(result.rows, function(row, done){

          if (duplicates[row.id.toString()] || row.html.match(/Question agreed to/) || row.html.match(/by leave.I move/) || row.html.match(/The time allotted for this debate has expired/) || row.html.match(/In accordance with standing order/)){
            return done();
          }

          // check for duplicates
          var dup = "select id from hansards where id <> $1 and date = $2 and html = $3 and speaker = $4 and speaker <> 'Honourable Members' ";
          db.query(dup, [row.id, row.date, row.html, row.speaker], function(err, result){
            if (err) return done(err);
            async.forEachSeries(result.rows, function(dupRow, done){
              if (row.html.length > 100){
                console.error("Found duplicate for " + row.id + " with id " + dupRow.id + " on " + row.date + " with " + row.html.length);
                duplicates[dupRow.id.toString()] = true;
                clearOut(dupRow.id, done);
              }else{
                done();
              }
            }, done);
          });

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

function clearOut(id, cb){

  // clear from hansards
  var deleteSql = 'delete from hansards where id = $1';
  db.query(deleteSql, [id], function(err){
    if (err) return cb(err);

    // clear out shards
    async.forEachSeries(shards, function(originalLetter, done){
      async.forEachSeries(shards, function(targetletter, done){
        var shard = originalLetter + targetletter;
        var query = 'delete from wordchoice_tokens_cluster_' + shard + ' where hansard_id = $1';
        db.query(query, [id], done);
      }, done);
    }, function(err){
      if (err) return cb(err);
      var deleteNonAlpha = 'delete from wordchoice_tokens_cluster_nonalpha where hansard_id = $1';
      db.query(deleteNonAlpha, [id], function(err){
        if (err) return cb(err);
        console.error("Cleared out data for " + id);
        console.log(id);
        cb();
      });
    });
  });
}
