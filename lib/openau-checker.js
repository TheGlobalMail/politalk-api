var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var Stream = require('stream');
require('date-utils');
var util = require('util');
var houses = ['representatives_debates', 'senate_debates'];

// A data event is emitted with the url for every available xml file after the
// date specified.
var OpenAuChecker = function(path, after, before){
  this.readable = true;
  this.path = path;
  this.readAfter = after;
  this.readBefore = before;
  if (!this.readBefore){
    this.readBefore = new Date();
  }
  Stream.call(this);
  process.nextTick(this.check.bind(this));
};

util.inherits(OpenAuChecker, Stream);

OpenAuChecker.prototype.check = function(){
  var self = this;
  async.forEach(houses, function(house, done){
    self.checkHouse(house, done);
  }, function(err){
    if (err) return self.emit('error', err);
    self.emit('end');
  });
};

OpenAuChecker.prototype.checkHouse = function(house, cb){
  var self = this;
  var indexUrl = this.path + '/' + house;
  request(indexUrl, function (err, response, body){

    var $, debates, debateOn;
    if (err) return cb("Unable to open " + indexUrl + ": " + err);
    if (response.statusCode != 200) return cb('Error status code: ' + response.statusCode + ' on ' + indexUrl);

    // Extract links to debates from the index page
    $ = cheerio.load(body); 
    debates = $('a').map(function(i, el){ return house + '/' + $(el).attr('href'); });

    // For each link to a debate after this.readAfter, download the xml
    debates.forEach(function(debate){
      var matchDate = debate.match(/\/(.*)\.xml/);
      if (matchDate){
        debateOn =  new Date(matchDate[1]);
        if (debateOn >= self.readAfter && debateOn <= self.readBefore){
          if (process.env.VERBOSE){
            console.error("DOWNLOADER: need " + self.path + '/' + debate);
          }
          self.emit('data', {date: debateOn, url: self.path + '/' + debate});
        }
      }
    });
    cb();
  });
};

module.exports = OpenAuChecker;
