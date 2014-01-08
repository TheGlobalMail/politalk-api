process.env.NODE_ENV = 'test';
var Hansard = require('../lib/hansard');
var assert = require('assert');
var async = require('async');
var helpers = require('./helpers');

describe('Hansard.filterDownloadedStream', function(){

  var stream = Hansard.filterDownloadedStream();

  beforeEach(function(done){
    async.series([
      helpers.loadSchema,
      helpers.loadMemberFixture,
      helpers.loadHansardFixtures,
    ], done);
  });

  describe('reading data with dates and house already with at least one hansard record', function(){

    it("filter them out by not emitting them", function(done){
      var data = [];
      stream.on('data', function(datum){
        data.push(datum);
      });
      stream.on('end', function(){
        assert(1, data.length);
        assert('senate', data[0].house);
        done();
      });
      stream.write({date: new Date(2012, 9, 10), house: 'senate'});
      stream.write({date: new Date(2012, 9, 10), house: 'house'});
      stream.end();
    });
  });

});
