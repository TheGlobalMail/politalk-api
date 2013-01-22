process.env.NODE_ENV = 'test';
var api = require('../api');
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
      function(cb){
        helpers.startApp(api, cb);
      }
    ], done);
  });

  it("should return a summary of how the word has been used over time", function(done){
    request(helpers.url + '/api/wordchoices/term/api', function(err, res, body){
      var json;
      assert(!err);
      assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
      json = JSON.parse(body);
      assert.equal(json.length, 1);
      assert.equal(json[0].party, 'Liberal Party');
      assert(json[0].week.toString().match('W30-2012'));
      assert(json[0].ids, 'test');
      assert.equal(json[0].freq, 12);
      done();
    });

  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});
