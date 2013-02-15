var shards = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; //, 'nonalpha'];
var db = require('./lib/db');
var async = require('async');
var indexes = [
  'CREATE INDEX wtSHARD_lower_word1_idx ON wordchoice_tokens_cluster_SHARD USING btree (lower((word1)::text));',
  'CREATE INDEX wtSHARD_lower_word12_idx ON wordchoice_tokens_cluster_SHARD USING btree (lower((word1)::text), lower((word2)::text));',
  'CREATE INDEX wtSHARD_lower_word123_idx ON wordchoice_tokens_cluster_SHARD USING btree (lower((word1)::text), lower((word2)::text), lower((word3)::text));',
  'CREATE INDEX wtSHARD_token1_idx ON wordchoice_tokens_cluster_SHARD USING btree (token1);',
  'CREATE INDEX wtSHARD_token12_idx ON wordchoice_tokens_cluster_SHARD USING btree (token1, token2);',
  'CREATE INDEX wtSHARD_token123_idx ON wordchoice_tokens_cluster_SHARD USING btree (token1, token2, token3);',
  'CREATE INDEX wtSHARD_party_date_idx ON wordchoice_tokens_cluster_SHARD USING btree (party, date);',
  'CREATE INDEX wtSHARD_week_idx ON wordchoice_tokens_cluster_SHARD USING btree (week);'
];

async.forEachSeries(shards, function(originalLetter, done){
  async.forEachSeries(shards, function(targetletter, done){
    async.forEachSeries(indexes, function(index, done){
      var shard = originalLetter + targetletter;
      var query = index.replace(/SHARD/g, shard);
      console.error("doing: " + query);
      db.query(query, function(err){
        if (err){
          console.error("..already exists");
        }else{
          console.error("..created");
        }
        done();
      });
    }, done);
  }, done);
}, function(err){
  db.end();
  console.error(err);
  console.error('done');
});

