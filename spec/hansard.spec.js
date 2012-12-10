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
      id = parser.convertId('uk.org.publicwhip/lords/2012-01-01.4.3');
      assert.equal(id, 'senate-2012-01-01.4.3');
    });

  });

  describe(".lastSpeechDate", function(){

    var lastDate = new Date('2020-11-3');

    beforeEach(function(done){
      var speech = {
        id: 'test', date: lastDate, 
        html: '', headingId: 1, subHeadingId: 1, 
        speaker_id: 1, speaker: 'test', timeOfDay: '11:00'
      };
      Hansard.addSpeech(speech, done);
    });

    it("should return the data of the last speech stored", function(done){
      Hansard.lastSpeechDate(function(err, date){
        assert(date.toString(), lastDate.toString());
        done();
      });
    });
  });

  describe(".parse called with xml data for a debate", function(){

    // XXX hardcoded test count. Increment this if you add a test! hack to simulate afterAll
    var specs = 4;

    beforeEach(function(done){
      helpers.clearHansard(function(){
        var parser = new Hansard.Parser();
        parser.on('end', done);
        parser.on('error', done);
        parser.write({date: date, xml: xml});
        parser.end();
      });
    });

    it("should extract headings", function(done){
      Hansard.byId('house-2012-10-30.3.1', function(err, section){
        assert(section, "No matching heading found");
        assert.equal(section.html, 'COMMITTEES');
        assert(section.major);
        assert.equal(section.date.toString(), (new Date('2012-10-30')).toString());
        done();
      });
    });

    it("should extract sub headings", function(done){
      Hansard.byId('house-2012-10-30.3.2', function(err, section){
        assert(section, "No matching sub heading found");
        assert.equal(section.html, 'Human Rights Committee; Membership');
        assert(section.minor);
        assert.equal(section.major_id, 'house-2012-10-30.3.1');
        assert.equal(section.date.toString(), (new Date('2012-10-30')).toString());
        done();
      });
    });

    it("should extract sections", function(done){
      Hansard.byId('house-2012-10-30.3.3', function(err, section){
        assert(section, "No matching speech found");
        assert(section.html.match(/a message from the Senate/));
        assert(!section.major);
        assert(!section.minor);
        assert.equal(section.major_id, 'house-2012-10-30.3.1');
        assert.equal(section.minor_id, 'house-2012-10-30.3.2');
        assert.equal(section.date.toString(), (new Date('2012-10-30')).toString());
        assert.equal(section.speaker_id, 68);
        assert.equal(section.speaker, 'Ms Anna Elizabeth Burke');
        assert.equal(section.time_of_day, '11:01');
        assert.equal(section.time, (new Date('2012-10-30 11:01')).toString());
        assert.equal(section.words, 50);
        assert.equal(section.duration, 200);
        assert.equal(section.talktype, 'speech');
        done();
      });
    });

    it("extract keywords", function(done){
      Hansard.Phrases.bySpeechId('house-2012-10-30.3.3', function(err, keywords){
        assert(keywords.length);
        assert.equal(keywords[0].text, 'human rights');
        assert.equal(keywords[0].stem, 'human right');
        assert(keywords[0].frequency);
        assert.equal(keywords[0].date.toString(), new Date('2012-10-30'));
        done();
      });
    });

    afterEach(function(){
      specs--;
      if (!specs) helpers.cleanup();
    });
  });

});
