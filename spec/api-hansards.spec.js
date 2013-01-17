process.env.NODE_ENV = 'test';
var api = require('../api');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');
var helpers = require('./helpers');

describe("/api/hansards", function(){

  beforeEach(function(done){
    async.series([
      helpers.loadSchema,
      helpers.loadMemberFixture,
      helpers.loadHansardFixtures,
      function(cb){
        helpers.startApp(api, cb);
      }
    ], done);
  });

  describe("called ids query parameter", function(){

    it("should return a list of hanards as json", function(done){
      request(helpers.url + '/api/hansards?ids=test', function(err, res, body){
        var json;
        assert(!err);
        assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
        console.error("Body: " + body);
        json = JSON.parse(body);
        assert.equal(json[0].speaker, 'John Howard');
        done();
      });
    });

  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});
