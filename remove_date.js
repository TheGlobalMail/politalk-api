var shards = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; //, 'nonalpha'];
var db = require('./lib/db');
var async = require('async');
var date = '2013-11-12';

async.forEachSeries(shards, function(originalLetter, done){
  async.forEachSeries(shards, function(targetletter, done){
    var shard = originalLetter + targetletter;
    var query = 'select count(*) as count from wordchoice_tokens_cluster_' + shard + ' where date = $1';
    //var query = 'delete from wordchoice_tokens_cluster_' + shard + ' where date = $1';
    db.query(query, [date], function(err, result){
      console.error('for ' + shard + ': ' + result.rows[0].count);
      //console.error('done ' + shard);
      done();
    });
  }, done);
}, function(err){
  db.end();
  console.error(err);
  console.error('done');
});

