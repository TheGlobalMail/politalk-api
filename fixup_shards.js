var shards = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; //, 'nonalpha'];
var db = require('./lib/db');
var async = require('async');

async.forEachSeries(shards, function(originalLetter, done){
  async.forEachSeries(shards, function(targetletter, done){
    var shard = originalLetter + targetletter;
    //var query = 'delete from wordchoice_tokens_cluster_' + shard + " where date > '2013-01-01'";
    db.query(query, done);
  }, done);
}, function(err){
  db.end();
  console.error(err);
  console.error('done');
});

