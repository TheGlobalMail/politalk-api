var db = require('../db');
var Stream = require('stream').Stream;
var util = require('util');
var cheerio = require('cheerio');
var Hansard = require('../hansard');
var async = require('async');

var Parser = function(date){
  this.writeable = true;
  this.date = date;
}
util.inherits(Parser, Stream);

Parser.prototype.convertId = function(id) {
  return id
    .replace('debate', 'house')
    .replace('lords', 'senate')
    .match(/uk.org.publicwhip\/(.*)\/(.*)/)
    .slice(1)
    .join('-');
};

Parser.prototype.write = function(data) {
  var $ = cheerio.load(data);
  var parser = this;
  var headingId, subHeadingId, previousTime;
  async.forEachSeries($('debates').children(), function(el, done){
    var $el = $(el), date, attrs = {};
    attrs.id = parser.convertId($el.attr('id'));
    attrs.date = parser.date;
    attrs.html = $el.html().trim();
    if (el.name === 'major-heading'){
      headingId = attrs.id;
      Hansard.addHeading(attrs, done);
    }else if (el.name === 'minor-heading'){
      subHeadingId = attrs.id;
      attrs.headingId = headingId;
      Hansard.addSubHeading(attrs, done);
    }else if (el.name === 'speech'){
      attrs.speaker = $el.attr('speakername');
      attrs.speaker_id = $el.attr('speakerid').replace(/.*\//, '');
      attrs.headingId = headingId;
      attrs.timeOfDay = parser.extractTimeOfDay(attrs.id, $el.attr('time'), previousTime);
      if (!attrs.timeOfDay){
        return done("Could not extract time of day from " + $el.attr('time') + " in " + 
          attrs.id + " with previous: " + previousTime);
      }
      previousTime = attrs.timeOfDay;
      attrs.words = parseInt($el.attr('approximate_wordcount'), 10);
      attrs.duration = parseInt($el.attr('approximate_duration'), 10);
      attrs.talktype = $el.attr('talktype');
      attrs.subHeadingId = subHeadingId;
      Hansard.addSpeech(attrs, done);
    }else if (el.name === 'division'){
      done();
    }else{
      done('unknown tag: ' + el.name);
    }
  }, function(err){
    if (err) parser.emit('error', err);
    parser.emit('end');
  });
};

// Does its best to extract the time of day from the xml data. Sometimes it's
// in the format 11:01. Other times, we just get :01. In the second case, we
// use the previousTime to guess the hour of the day
Parser.prototype.extractTimeOfDay = function(id, time, previousTime) {
  var timeOfDayMatch = time.match(/(\d\d):\s*(\d\d)/);
  var previousDigits, previousHour, previousMinute;
  var currentMinute;
  if (timeOfDayMatch){
    return timeOfDayMatch[1] + ':' + timeOfDayMatch[2];
  }else if (previousTime){
    previousDigits = previousTime.split(':');
    previousHour = parseInt(previousDigits[0], 10);
    previousMinute = parseInt(previousDigits[1], 10);
    timeOfDayMatch = time.match(/:\s*(\d\d)/);
    if (timeOfDayMatch){
      currentMinute = timeOfDayMatch[1];
      if (previousMinute <= parseInt(currentMinute, 10)){
        console.info('Reconstructed ' + previousHour + ':' + currentMinute + 
            ' from ' + time + ' on ' + id + " using " + previousTime);
        return previousHour + ':' + currentMinute;
      }
    }
  }
  console.log("Could not extract time of day from " + time + " in " + 
          id + ". Using previous: " + previousTime);
  return previousTime;
};

exports.Parser = Parser;
