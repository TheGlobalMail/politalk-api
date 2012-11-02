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
  var headingId, heading, subHeadingId, subHeading;
  async.forEachSeries($('debates').children(), function(el, done){
    var $el = $(el), date, attrs = {};
    attrs.id = parser.convertId($el.attr('id'));
    attrs.date = parser.date;
    attrs.html = $(el).html().trim();
    if (el.name === 'major-heading'){
      heading = attrs.html;
      headingId = attrs.id;
      Hansard.addHeading(attrs, done);
    }else{
      done();
    }
  }, function(err){
    if (err) parser.emit('error', err);
    parser.emit('end');
  });
};

exports.Parser = Parser;
