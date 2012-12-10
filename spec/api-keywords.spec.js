process.env.NODE_ENV = 'test';
var api = require('../api');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');
var helpers = require('./helpers');

describe("/api/keywords", function(){

  beforeEach(function(done){
    async.series([
      helpers.clearMembers,
      helpers.clearHansard,
      helpers.loadHansard,
      helpers.calculateMemberSummaries,
      helpers.calculatePhraseSummaries,
      helpers.calculateSummary,
      function(cb){
        helpers.startApp(api, cb);
      }
    ], done);
  });

  describe("with no parameters", function(){

    it("should return a list of keywords ordered by frequency", function(done){
      helpers.testApi(helpers.url + '/api/keywords', function(err, json){
        assert.equal(json[0].text, 'politalk api');
        assert.equal(json[0].frequency, 12);
        done();
      });
    });

  });

  describe("with from and to parameters", function(){

    it("should return a list of keywords ordered by frequency", function(done){
      helpers.testApi(helpers.url + '/api/keywords?from=2006-12-01&to=2040-12-01', function(err, json){
        assert.equal(json[0].text, 'politalk api');
        assert.equal(json[0].frequency, 12);
        done();
      });
    });

  });

  describe("with house and party parameters", function(){

    it("should return a list of keywords ordered by frequency", function(done){
      helpers.testApi(helpers.url + '/api/keywords?house=1&party=Liberal+Party', function(err, json){
        assert.equal(json[0].text, 'politalk api');
        assert.equal(json[0].frequency, 12);
        done();
      });
    });

  });

  describe("with speaker_id parameters", function(){

    it("should return a list of keywords ordered by frequency", function(done){
      helpers.testApi(helpers.url + '/api/keywords?speaker_id=265', function(err, json){
        assert.equal(json[0].text, 'politalk api');
        assert.equal(json[0].frequency, 12);
        done();
      });
    });

  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});
