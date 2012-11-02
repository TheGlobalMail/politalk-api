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
  var headingId, subHeadingId;
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
      attrs.time = $el.attr('time');
      attrs.words = $el.attr('wordcount');
      attrs.subHeadingId = subHeadingId;
      Hansard.addSpeech(attrs, done);
    }else{
      done('unknown tag: ' + el.name);
    }
  }, function(err){
    if (err) parser.emit('error', err);
    parser.emit('end');
  });
};

exports.Parser = Parser;
