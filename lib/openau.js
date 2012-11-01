var url = require('url');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('lodash');
var stream = require('stream')
var util = require('util')
var houses = ['representatives_debates', 'senate_debates'];

// Implements a readable stream that downloads any new debates xml files from
// OpenAustralia after the date specified.
//
// A data event is emitted with the xml for every file downloaded
var OpenAu = function(path, readAfter){
  this.readable = true;
  this.path = path;
  this.readAfter = readAfter;
  this.readDebates();
};

util.inherits(OpenAu, stream.Stream)

OpenAu.prototype.readDebates = function(){
  var self = this;
  async.forEach(houses, function(house, done){
    self.readDebatesForHouse(house, done);
  }, function(err){
    if (err) return self.emit('error', err);
    self.emit('end');
  });
};

OpenAu.prototype.readDebatesForHouse = function(house, cb){
  var self = this;
  request(this.path + house, function (err, response, body){

    var $, debates, debateOn;
    if (err) return cb(err);
    if (response.statusCode != 200) return cb('Error status code: ' + response.statusCode);

    // Extract links to debates from the index page
    $ = cheerio.load(body); 
    debates = $('a').map(function(i, el){ return house + '/' + $(el).attr('href'); });

    // For each link to a debate after this.readAfter, download the xml
    async.forEach(debates, function(debate, done){
      var matchDate = debate.match(/\/(.*)\.xml/);
      if (matchDate){
        debateOn =  new Date(matchDate[1]);
        if (debateOn > self.readAfter){
          return self.downloadDebate(debateOn, debate, done);
        }
      }
      done();
    }, cb);
  });
};

OpenAu.prototype.downloadDebate = function(debateOn, debate, cb){
  var self = this;
  request(this.path + debate, function (err, response, body){
    if (err) return cb(err);
    if (response.statusCode != 200) return cb('Error status code: ' + response.statusCode);
    self.emit('data', body, debateOn);
    cb();
  });
};

exports.OpenAu = OpenAu;
