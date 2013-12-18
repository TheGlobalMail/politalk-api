var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var Stream = require('stream');
require('date-utils');
var util = require('util');

// A data event is emitted with the url for every available xml file after the
// date specified.
var OpenAuChecker = function(path, options){
  if (!options) options = {};
  this.readable = true;
  this.path = path;
  this.readAfter = options.after;
  this.readBefore = options.before;
  if (options.house === 'representatives'){
    this.houses = ['representatives_debates'];
  }else if (options.house === 'senate'){
    this.houses = ['senate_debates'];
  }else{
    this.houses = ['representatives_debates', 'senate_debates'];
  }
  if (process.env.VERBOSE) console.error('Checking houses: ' + this.houses.join(' and '));
  Stream.call(this);
  process.nextTick(this.check.bind(this));
};

util.inherits(OpenAuChecker, Stream);

OpenAuChecker.prototype.check = function(){
  var self = this;
  async.forEach(this.houses, function(house, done){
    self.checkHouse(house, done);
  }, function(err){
    if (err) return self.emit('error', err);
    self.emit('end');
  });
};

OpenAuChecker.prototype.checkHouse = function(house, cb){
  var self = this;
  var indexUrl = this.path + '/' + house;
  console.error('DOWNLOADER: request ' + indexUrl);
  request(indexUrl, function (err, response, body){

    var $, debates, debateOn;
    if (err) return cb('Unable to open ' + indexUrl + ': ' + err);
    if (response.statusCode != 200) return cb('Error status code: ' + response.statusCode + ' on ' + indexUrl);

    // Extract links to debates from the index page
    $ = cheerio.load(body);
    debates = $('a').map(function(i, el){ return house + '/' + $(el).attr('href'); });

    // For each link to a debate after this.readAfter, emit data about the
    // date, house and path
    console.error('DOWNLOADER: examining ' + debates.length + ' xml files');
    debates.forEach(function(debate){
      var matchDate = debate.match(/\/(.*)\.xml/);
      if (matchDate){
        debateOn =  new Date(matchDate[1]);
        if ((!self.readAfter || debateOn >= self.readAfter) && (!self.readBefore || debateOn <= self.readBefore)){
          if ((self.readBefore || self.readAfter) && process.env.VERBOSE){
            console.error('DOWNLOADER: in date range ' + self.path + '/' + debate);
          }
          self.emit('data', {date: debateOn, house: house, url: self.path + '/' + debate});
        }
      }
    });
    cb();
  });
};

module.exports = OpenAuChecker;
