process.env.NODE_ENV = 'test';
var Hansard = require('../lib/hansard');
var fs = require('fs');
var assert = require('assert');
var helpers = require('./helpers');

describe('Hansard.Parser', function(){

  var xml = fs.readFileSync('./spec/fixtures/representatives_debates/2012-10-30.xml');
  var date = new Date('2012-10-30');

  describe(".convertId", function(){

    it("should convert uk style ids to something shorter and nicer", function(){
      var parser = new Hansard.Parser(date);
      var id = parser.convertId('uk.org.publicwhip/debate/2012-10-30.4.3');
      assert.equal(id, 'house-2012-10-30.4.3');
      var id = parser.convertId('uk.org.publicwhip/lords/2012-01-01.4.3');
      assert.equal(id, 'senate-2012-01-01.4.3');
    });

  });

  describe(".parse called with xml data for a debate", function(){

    beforeEach(function(done){
      helpers.clearHansard(function(){
        var parser = new Hansard.Parser(date);
        parser.on('end', done);
        parser.on('error', done);
        parser.write(xml);
      });
    });

    it("should extract headings", function(done){
      Hansard.byId('house-2012-10-30.3.1', function(err, section){
        assert(section, "No matching section found");
        assert(section.html.trim(), 'COMMITTEES');
        assert(section.major);
        assert(section.date.toString(), (new Date('2012-10-30')).toString());
        assert(!section.time);
        done();
      });
    });

    afterEach(function(){
      helpers.cleanup();
    });
  });

});
