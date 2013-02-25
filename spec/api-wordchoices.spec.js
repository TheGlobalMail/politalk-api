process.env.NODE_ENV = 'test';
var api = require('../api');
var db = require('../lib/db');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');
var helpers = require('./helpers');

describe("/api/wordchoices/term/:term", function(){

  beforeEach(function(done){
    async.series([
      helpers.loadSchema,
      helpers.loadMemberFixture,
      helpers.loadHansardFixtures,
      helpers.loadSearchIndexes,
      helpers.clearWordChoicesCache,
      function(cb){
        helpers.startApp(api, cb);
      }
    ], done);
  });

  describe("with the term 'api'", function(){

    it("should return a summary of how the word has been used over time", function(done){
      request(helpers.url + '/api/wordchoices/term/politalk%20api', function(err, res, body){
        var json;
        assert(!err);
        assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
        json = JSON.parse(body);
        assert.equal(json.data.length, 1);
        assert.equal(json.data[0].party, 'Liberal Party');
        assert(json.data[0].week.toString().match('2012-41'));
        assert(json.data[0].ids, 'test');
        assert.equal(json.exact, false);
        assert.equal(json.tokens, 'politalk api');
        assert.equal(json.data[0].freq, 1);
        done();
      });
    });

  });

  describe("with the term Apis and complete match parameter passed", function(){

    it("should return a summary of how the word has been used over time", function(done){
      request(helpers.url + '/api/wordchoices/term/politalk%20api?c=1', function(err, res, body){
        var json;
        assert(!err);
        assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
        json = JSON.parse(body);
        var data = json.data;
        assert.equal(data.length, 1);
        assert.equal(data[0].party, 'Liberal Party');
        assert(data[0].week.toString().match('2012-41'));
        assert(data[0].ids, 'test1');
        assert.equal(json.exact, true);
        assert.equal(json.tokens, 'politalk api');
        assert.equal(data[0].freq, 1);
        done();
      });
    });

  });

  describe("with a term that has not been searched before", function(){

    it("should save the results in the wordchoice_cache table", function(done){
      request(helpers.url + '/api/wordchoices/term/politalk%20api?c=1', function(err, res, body){
        var sql = 'select * from wordchoices_cache where term = $1 and exactMatch = $2';
        assert(!err);
        db.query(sql, ['politalk api', true], function(err, result){
          assert(!err);
          var cache = result.rows[0];
          assert(cache, "The result did not appeared to cached in the wordchoices_cache table");
          assert.equal(1, cache.requested);
          assert.equal(false, cache.toomany);
          assert.equal(1, cache.resultcount);
          assert(cache.data);
          assert(cache.time);
          done();
        });
      });
    });
  });

  describe("with a term that HAS ALREADY been searched before", function(){

    it("should returned the cached results and update the requested count", function(done){
      request(helpers.url + '/api/wordchoices/term/politalk%20api?c=1', function(err, res, body){
        request(helpers.url + '/api/wordchoices/term/politalk%20api?c=1', function(err, res, body){
          var json;
          assert(!err);
          assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
          json = JSON.parse(body);
          var data = json.data;
          assert.equal(data.length, 1);
          assert.equal('1', res.headers['x-cached-wordchoice']);
          var sql = 'select * from wordchoices_cache where term = $1 and exactMatch = $2';
          setTimeout(function(){
            db.query(sql, ['politalk api', true], function(err, result){
              assert(!err);
              var cache = result.rows[0];
              assert.equal(2, cache.requested);
              done();
            });
          }, 400);
        });
      });
    });
  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});
