process.env.NODE_ENV = 'test';
var stream =  require('../lib/members-loader');
var assert = require('assert');
var db = require('../lib/db');
var async = require('async');
var _ = require('lodash');
var helpers = require('./helpers');
var fs = require('fs');
var cache = require('../lib/cache');

describe("cache.rebuildWordchoicesCache", function(){

  beforeEach(function(done){
    async.series([
      helpers.loadSchema,
      helpers.loadMemberFixture,
      helpers.loadHansardFixtures,
      helpers.loadSearchIndexes,
      helpers.clearWordChoicesCache,
      function(done){
        var sql = "insert into wordchoices_cache (term, exactmatch, time, requested, toomany, resultcount, data) values " + 
          "($1, $2, $3, $4, $5, $6, $7)";
        db.query(sql, ['api', false, new Date(), 1, false, 0, {data: []}], function(err){
          if (err) return done(err);
          done();
        });
      }
    ], done);
  });

  it("should recalculate all results in the wordchoices_cache table", function(done){
    var stream = cache.rebuildCacheStream(); 
    stream.on('end', function(){
      var query = 'select * from wordchoices_cache where term = $1 and exactMatch = $2';
      db.query(query, ['api', false], function(err, result){
        var reCalculatedCache = result.rows[0];
        assert.equal(1, reCalculatedCache.resultcount);
        db.end();
        done();
      });
    });
    stream.write({});
    stream.end();
  });
});
