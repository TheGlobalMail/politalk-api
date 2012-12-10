process.env.NODE_ENV = 'test';
var Hansard = require('../lib/hansard');
var fs = require('fs');
var assert = require('assert');
var helpers = require('./helpers');

describe('Hansard.Parser', function(){

  describe(".parse called with xml data for a debate", function(){

    var xml = fs.readFileSync('./spec/fixtures/representatives_debates/2006-02-07.xml');
    var date = new Date('2006-02-07');
    var lastDate = new Date('2020-11-3');

    beforeEach(function(done){
      helpers.clearHansard(function(){
        helpers.clearMembers(function(){
          var parser = new Hansard.Parser();
          parser.on('end', done);
          parser.on('error', done);
          parser.write({date: date, xml: xml});
          parser.end();
        });
      });
    });

    it("should extract speeches", function(done){
      Hansard.byId('house-2006-02-07.3.3', function(err, section){
        assert(section, "No matching speech found");
        assert(section.html.match(/that this house records its deep regret/mi));
        assert(!section.major);
        assert(!section.minor);
        assert.equal(section.major_id, 'house-2006-02-07.3.1');
        assert.equal(section.minor_id, 'house-2006-02-07.3.2');
        assert.equal(section.date.toString(), (new Date('2006-02-07')).toString());
        assert.equal(section.speaker_id, 265);
        assert.equal(section.speaker, 'John Winston Howard');
        assert.equal(section.time_of_day, '14:01');
        assert.equal(section.time, (new Date('2006-02-07 14:01')).toString());
        assert.equal(section.words, 965);
        assert.equal(section.duration, 7 * 60);
        assert.equal(section.talktype, 'speech');
        done();
      });
    });

    it("should extract interjections", function(done){
      Hansard.byId('house-2006-02-07.5.4', function(err, interjection){
        assert(interjection, "No matching speech found");
        assert.equal(interjection.duration, 0);
        assert.equal(interjection.words, 4);
        assert.equal(interjection.talktype, 'interjection');
        done();
      });
    });

    it("should extract continuations", function(done){
      Hansard.byId('house-2006-02-07.5.5', function(err, continuation){
        assert(continuation, "No matching speech found");
        assert.equal(continuation.duration, 0);
        assert.equal(continuation.talktype, 'continuation');
        done();
      });
    });

    it("should use adjournments at the end of speeches to calculate the duration of a speech", function(done){
      Hansard.byId('house-2006-02-07.13.8', function(err, speech){
        assert(speech, "No matching speech found");
        assert.equal(speech.duration, Math.round(speech.words / 120) * 60);
        assert.equal(speech.talktype, 'speech');
        done();
      });
    });
    
    it("should fallback to a wordcount estimate if the time is out by more than 10 minutes", function(done){
      Hansard.byId('house-2006-02-07.71.3', function(err, speech){
        assert(speech, "No matching speech found");
        assert.equal(speech.duration, 120);
        assert.equal(speech.talktype, 'speech');
        done();
      });
    });
    
    it("should set the speaker_id to be the member_id if the speaker_id cannot be found", function(done){
      Hansard.byId('house-2006-02-07.13.8', function(err, speech){
        assert(speech, "No matching speech found");
        assert.equal(speech.speaker_id, 265);
        done();
      });
    });


    afterEach(function(){
      helpers.cleanup();
    });
  });
});
