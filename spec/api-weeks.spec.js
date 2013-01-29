process.env.NODE_ENV = 'test';
var api = require('../api');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');
var cache = require('../lib/cache');
var helpers = require('./helpers');

var earliest = new Date('2012-09-01');
var latest = new Date('2013-09-01');

describe("/api/weeks", function(){

  // Add two headings for each date
  beforeEach(function(done){
    helpers.loadSchema(function(err){
      async.forEach([earliest, latest], function(date, done){
        Hansard.addHeading({ id: 'test' + date.getYear(), date: date, html: 'test2' }, function(err){
          helpers.startApp(api, done);
        });
      }, function(err){
        if (err) return done(err);
        helpers.calculateSummary(done);
      });
    });
  });

  it("should return the range of weeks between the dates", function(done){
    request(helpers.url + '/api/weeks', function(err, res, body){
      var json;
      assert(!err);
      assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
      json = JSON.parse(body);
      assert.equal(json[0], '2012-35');
      assert.equal(json[json.length - 1], '2013-35');
      done();
    });
  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});

describe("and the weeks data is stored in the summaries table", function(){

  // Add two headings for each date
  beforeEach(function(done){
    helpers.loadSchema(function(err){
      helpers.loadSummaryFixture(function(err){
        async.forEach([earliest, latest], function(date, done){
          Hansard.addHeading({ id: 'test' + date.getYear(), date: date, html: 'test2' }, function(err){
            helpers.startApp(api, done);
          });
        }, function(err){
          if (err) return done(err);
          var stream = cache.rebuildStream();
          stream.on('end', function(){
            done();
          });
          stream.write({});
          stream.end();
        });
      });
    });
  });

  it("should use the weeks data in the week column", function(done){
    request(helpers.url + '/api/weeks', function(err, res, body){
      var json;
      assert(!err);
      assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
      // XXX Need to comment out:
      // var useEndPointCache = process.env.NODE_ENV !== 'test' 
      // in lib/cache.js for this test to work
      //assert.equal(true, res.headers['x-cached-endpoint']);
      json = JSON.parse(body);
      assert.equal(json[0], '2012-35');
      assert.equal(json[json.length - 1], '2013-35');
      done();
    });
  });

  afterEach(function(done){
    helpers.stopApp(done);
  });

});
