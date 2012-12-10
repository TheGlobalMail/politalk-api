process.env.NODE_ENV = 'test';
var api = require('../api');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');
var helpers = require('./helpers');
var util = require('util');

describe("/api", function(){

  beforeEach(function(done){
    async.series([
      helpers.clearMembers,
      helpers.clearHansard,
      helpers.loadHansard,
      helpers.calculateMemberSummaries,
      helpers.calculateSummary,
      function(cb){
        helpers.startApp(api, cb);
      }
    ], done);
  });

  it("should return an etag that based on the hansard count", function(done){
    request(helpers.url + '/api/members', function(err, res, body){
      assert(!err);
      assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
      assert(res.headers.etag, "Returned unexpected etag: " + util.inspect(res.headers));
      done();
    });
  });

  it("should cache the result using an etag", function(done){
    request(helpers.url + '/api/members', function(err, res, body){
      var options = {
        url: helpers.url + '/api/members',
        headers: {'If-None-Match': res.headers.etag}
      };
      assert(res.headers.etag);
      request(options, function(err, res, body){
        assert(!err);
        assert(res.statusCode == '304', "Expected a 304 with etag");
        done();
      });
    });
  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});
