var shards = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; //, 'nonalpha'];
var db = require('./lib/db');
var async = require('async');

async.forEachSeries(shards, function(originalLetter, done){
  async.forEachSeries(shards, function(targetletter, done){
    var shard = originalLetter + targetletter;
    var query = 'create index hansard_id_' + shard + ' on wordchoice_tokens_cluster_' + shard + ' using btree(hansard_id)';
    db.query(query, done);
  }, done);
}, function(err){
  db.end();
  console.error(err);
  console.error('done');
});

