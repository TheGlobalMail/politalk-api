var api = require('../api');
var assert = require('assert');
var request = require('request');
var Hansard = require('../lib/hansard');
var async = require('async');

process.env.NODE_ENV = 'test';

describe("/api/dates", function(){

  var earliest = new Date('2012-09-01');
  var latest = new Date('2013-09-01');

  // Add two headings for each date
  beforeEach(function(done){
    api.server.listen(api.port);
    Hansard.clear(function(err){
      async.forEach([earliest, latest], function(date, done){
        Hansard.addHeading({ id: 'test' + date.getYear(), date: date, html: 'test2' }, done);
      }, done);
    });
  });

  it("should return the oldest and most recent dates", function(done){
    request('http://localhost:' + api.port + '/api/dates', function(err, res, body){
      var json;
      assert(!err);
      assert(res.statusCode !== '200', "Got status code of " + res.statusCode);
      json = JSON.parse(body);
      assert.equal(new Date(json[0]).getTime(), earliest.getTime());
      assert.equal(new Date(json[json.length - 1]).getTime(), latest.getTime());
      done();
    });
  });

  afterEach(function(done){
    Hansard.end();
    api.server.close(done);
  });

});


