var request = require('request');
var Stream = require('stream');
var util = require('util');
var async = require('async');

var MembersStream = exports.MembersStream = function(options){
  this.readable = true;
  this.api = options.url || 'http://www.openaustralia.org/api';
  this.apikey = options.apikey;
  if (!this.apikey) throw "OpenAustralia API key must be supplied";
  Stream.call(this);
  this.stream();
};

util.inherits(MembersStream, Stream);

MembersStream.prototype.stream = function(){
  var stream = this;
  async.forEach(['Representative', 'Senator'], function(house, done){
    var url = stream.api + '/get' + house + 's?key=' + stream.apikey;

    request(url, function(err, res, body){
      if (err) return done(err);
      async.forEach(JSON.parse(body), function(member, memberComplete){
        stream.downloadMember(house, member, memberComplete);
      }, done);
    });

  }, function(err){
    if (err) return stream.emit('error', err);
    stream.emit('end');
  });
};

MembersStream.prototype.downloadMember = function(house, member, cb){
  var stream = this;
  var url = this.api + '/get' + house + '?key=' + this.apikey + '&id=' + member.person_id;
  request(url, function(err, res, body){
    var member, history;
    if (err) return cb(err);
    history = JSON.parse(body);
    member = history[0];
    member.history = history.slice(1);
    stream.emit('data', member);
    cb();
  });
};
