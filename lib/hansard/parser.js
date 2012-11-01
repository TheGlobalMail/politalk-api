var db = require('../db');
var Stream = require('stream').Stream;
var util = require('util');
var XmlStream = require('xml-stream');

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
  var currentMajor, currentMinor, self = this;;
  var dataStream = new Stream();
  /*
  var xml = new XmlStream(dataStream);
  xml.on('startElement: major-heading', function(item){
    currentMajor = item.$.id;
    console.log('inserting heading' + item.$.id);
  });
  xml.on('startElement: major-heading', function(item){
    currentMinor = item.$.id;
    console.log('inserting heading' + item.$.id);
  });
  xml.collect('p');
  xml.on('endElement: speech', function(item){
    console.log('adding section with ' + currentMajor + '/' + currentMinor);
  });
  xml.on('end', function(){ self.emit('end'); });
  xml.on('error', function(err){ self.emit('error', err); });
  dataStream.emit('data', data);
  */
};

Parser.prototype.end = function() {
  this.emit('end');
};

exports.Parser = Parser;
