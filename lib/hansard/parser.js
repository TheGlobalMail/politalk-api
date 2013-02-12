var db = require('../db');
var Stream = require('stream').Stream;
var _ = require('lodash');
var _str = require('underscore.string');
var util = require('util');
var cheerio = require('cheerio');
var Hansard = require('../hansard');
var async = require('async');
var Stream = require('stream');
var util = require('util');
var moment = require('moment');

var Parser = function(options){
  if (!options) options = {};
  this.writable = true;
  this.readable = true;
  this.queue = 0;
  this.ended = false;
  this.emittedEnd = false;
  if (options.metadata){
    this.forceMetaData = true;
  }
  Stream.call(this);
};
util.inherits(Parser, Stream);

Parser.prototype.convertId = function(id) {
  return id
    .replace('debate', 'house')
    .replace('lords', 'senate')
    .match(/uk.org.publicwhip\/(.*)\/(.*)/)
    .slice(1)
    .join('-');
};

// Expects data to have two the keys `date` and `xml`. Date is the date that
// hansard was from. Xml is the parser data
Parser.prototype.write = function(data) {
  var parser = this;
  parser.queue++;

  var sections = this.parse(data.xml, data.date);

  if (this.needToCalculateExtraMetadata(sections)){
    if (process.env.VERBOSE){
      console.error("DOWNLOADER: calculating extra metadata");
    }
    sections = this.calculateExtraMetadata(sections);
  }

  if (process.env.VERBOSE){
    debug(sections);
  }

  this.save(sections, function(err){
    if (err) return parser.emit('error', err);
    parser.queue--;
    if (!parser.queue && parser.ended){
      parser.emit('end');
    }
  });

  return true;
};

// Return true speeches are missing the duration, words or talktype attributes.
// This occurs if we're parsing pre 2011 data.
Parser.prototype.needToCalculateExtraMetadata = function(sections) {
  return this.forceMetaData || _.detect(sections, function(section){
    return section.type === 'speech' && section.duration === null;
  });
};

Parser.prototype.calculateExtraMetadata = function(sections) {
  var parser = this;
  var currentSpeech;
  var currentSpeechIndex;
  _.each(sections, function(section, index){
    var adjournment, duration, durationFromWordCount;
    if (section.type === 'speech'){
      section.words = _str.stripTags(section.html.replace(/<\/p>/gmi, "</p>\n")).split(/\s+/).length;
      section.totalWords = section.words;
      adjournment = section.html.match(/adjourned at (\d+:\d\d)/mi);
    }
    if (currentSpeech && section.type === 'speech' && section.speaker_id === currentSpeech.speaker_id){
      section.talktype = 'continuation';
      section.duration = 0;
      // Record total words in the speech including continuations
      currentSpeech.totalWords += section.words;
    }else if (currentSpeech && section.type === 'speech' && section.speaker_id !== currentSpeech.speaker_id && section.words < 20){
      section.talktype = 'interjection';
      section.duration = 0;
    }else if (section.type === 'speech'){
      if (currentSpeech){
        duration = moment.duration(getTime(section) - getTime(currentSpeech)).asSeconds();
        durationFromWordCount = estimateDurationFromWordCount(currentSpeech.totalWords);
        // If the duration seems out by 10 minutes, fallback to estimate of time
        // assuming they spoke at around 120 words per minute
        //console.error(currentSpeech.timeOfDay + ': ' + currentSpeech.id + " (" + currentSpeech.speaker + ") comparing " + duration + " with " + durationFromWordCount + " (" + currentSpeech.totalWords + " and " + currentSpeech.words + " )");
        if (duration < 0 || Math.abs(duration - durationFromWordCount) > 600){
          //console.error('using estimate ' + durationFromWordCount);
          sections[currentSpeechIndex].duration = durationFromWordCount;
        }else{
          sections[currentSpeechIndex].duration = duration;
        }
        sections[currentSpeechIndex].talktype = 'speech';
      }
      if (adjournment){
        section.duration = moment.duration(getTime(section, adjournment[1] + ':' + adjournment[2]) - getTime(section)).asSeconds();
        if (section.duration < 0 || section.duration > 600){
          section.duration = estimateDurationFromWordCount(section.words);
        }
        section.talktype = 'speech';
      }else{
        currentSpeech = section;
        currentSpeechIndex = index;
      }
    }
  });
  if (currentSpeech){
    sections[currentSpeechIndex].duration = estimateDurationFromWordCount(sections[currentSpeechIndex].words);
    sections[currentSpeechIndex].talktype = 'speech';
  }
  return sections;
};

// Parse the heading, subheadings and speeches from the data and return as a
// list of objects
Parser.prototype.parse = function(xml, date) {
  var $ = cheerio.load(xml);
  var parser = this;
  var headingId, subHeadingId, previousTime;
  var sections = [];
  _.each($('debates').children(), function(el){
    var $el = $(el), attrs = {};
    attrs.id = parser.convertId($el.attr('id'));
    attrs.date = date;
    attrs.html = $el.html().trim();
    attrs.type = el.name;
    if (el.name === 'major-heading'){
      headingId = attrs.id;
    }else if (el.name === 'minor-heading'){
      subHeadingId = attrs.id;
      attrs.headingId = headingId;
    }else if (el.name === 'speech'){
      attrs.timeOfDay = parser.extractTimeOfDay(attrs.id, $el.attr('time'), previousTime);
      if (!attrs.timeOfDay){
        //console.error("Could not extract time of day from " + $el.attr('time') + " in " + 
        //  attrs.id + " with previous: " + previousTime + '. skipping..');
        return;
      }
      if (!$el.attr('speakerid')){
        //console.error("Could not extract speaker id from " + attrs.id + ". Skipping..");
        return;
      }
      attrs.speaker = $el.attr('speakername');
      attrs.headingId = headingId;
      attrs.speaker_id = $el.attr('speakerid').replace(/.*\//, '');
      previousTime = attrs.timeOfDay;
      attrs.words = parseInt($el.attr('approximate_wordcount'), 10);
      attrs.duration = parseInt($el.attr('approximate_duration'), 10);
      attrs.talktype = $el.attr('talktype');
      attrs.subHeadingId = subHeadingId;
    }
    sections.push(attrs);
  });
  return sections;
};

// Save each of the sections to the database
Parser.prototype.save = function(sections, cb) {
  var parser = this;
  async.forEachSeries(sections, function(section, done){

    var emit = function(err){
      if (err) return done(err);
      parser.emit('data', section);
      done();
    };

    if (section.type === 'major-heading'){
      Hansard.addHeading(section, emit);
    }else if (section.type === 'minor-heading'){
      Hansard.addSubHeading(section, emit);
    }else if (section.type === 'speech'){
      Hansard.addSpeech(section, emit);
    }else if (section.type === 'division'){
      done();
    }else{
      done('unknown section type: ' + section.type);
    }
  }, cb);
};

Parser.prototype.end = function(data) {
  this.ended = true;
  if (data) this.write(data);
  if (!this.queue) this.emit('end');
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
        //console.error('Reconstructed ' + previousHour + ':' + currentMinute + 
        //    ' from ' + time + ' on ' + id + " using " + previousTime);
        return previousHour + ':' + currentMinute;
      }
    }
  }
  //console.error("Could not extract time of day from " + time + " in " + 
  //        id + ". Using previous: " + previousTime);
  return previousTime;
};

function getTime(speech, altTime){
  return Hansard.workOutTime(speech.date, altTime || speech.timeOfDay).getTime();
}

function estimateDurationFromWordCount(words){
  return Math.round(words / 120) * 60;
}

function debug(sections){
  _.each(sections, function(section){
    if (section.type === 'speech'){
      console.error('DOWNLOADER: ' + section.timeOfDay + ' | ' + section.speaker + ' (' + section.talktype + '): ' + section.duration + ' (words = ' + section.words + ')');
    }else{
      console.error('DOWNLOADER: ' + section.type);
    }
  });
}

exports.Parser = Parser;
