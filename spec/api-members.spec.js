process.env.NODE_ENV = 'test';
var api = require('../api');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');
var helpers = require('./helpers');

describe("/api/members", function(){

  beforeEach(function(done){
    async.series([
      helpers.loadSchema,
      helpers.loadMemberFixture,
      helpers.loadHansardFixtures,
      helpers.calculateMemberSummaries,
      helpers.calculateSummary,
      helpers.rebuildMembersCache,
      function(cb){
        helpers.startApp(api, cb);
      }
    ], done);
  });

  it("should return a list of members as json sort by duration", function(done){
    request(helpers.url + '/api/members', function(err, res, body){
      var json;
      assert(!err);
      assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
      json = JSON.parse(body);
      assert.equal(json[0].speaker, 'John Howard');
      assert.equal(json[0].url, 'http://www.openaustralia.org/mp/john_howard/bennelong');
      done();
    });
  });

  it("should cache to /api/members/year for each year", function(done){
    helpers.testApi(helpers.url + '/api/members/year?from=2012-01-01', function(err, json){
      var json;
      assert(!err);
      assert.equal(json[0].speaker, 'John Howard');
      assert.equal(json[0].url, 'http://www.openaustralia.org/mp/john_howard/bennelong');
      done();
    });
  });


  afterEach(function(done){
    helpers.stopApp(done);
  });

});
