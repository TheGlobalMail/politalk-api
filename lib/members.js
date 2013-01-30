var request = require('request');
var Stream = require('stream');
var util = require('util');
var async = require('async');
var dates = require('./dates');
var db = require('./db');
var _ = require('lodash');
var openAuUrl = 'http://www.openaustralia.org';

exports.find = function(){
  var args = [].concat.apply([], arguments);

  if (args.length === 1){
    from = null;
    to = null;
    cb = args[0];
  }else{
    from = args[0];
    to = args[1];
    cb = args[2];
  }

  var query = "select sum(duration) as duration, speaker, first_name, " +
    "last_name, speaker_id, person_id, party, " +
    "sum(interjections) as interjections, " + 
    "sum(speeches) as speeches, " +
    "house, sum(words) as words, count(*) as total, image, entered_house, " +
    "left_house, left_reason, constituency from member_summaries " + 
    "where date between $1 and $2 " + 
    "group by speaker_id,speaker,person_id,party,house,first_name,last_name,image, " + 
    "entered_house, left_house, left_reason,constituency " +
    "order by sum(duration) desc";
  var values = [dates.getFrom(from), dates.getTo(to)];

  db.query(query, values, function(err, result) {
    var members;
    if (err) return cb(err);
    members = result.rows;
    _.each(members, function(member, index){
      member.id = member.speaker_id;
      member.rank = index + 1;
      member.dates = [];
      member.durations = [];
      member.url = openAuUrl + '/mp/' + 
        [member.first_name, member.last_name].join('_') + 
        '/' + member.constituency;
      member.url = member.url.toLowerCase();
    });
    cb(err, members);
  });
};

var MembersStream = exports.MembersStream = function(options){
  this.readable = true;
  this.api = options.url || openAuUrl + '/api';
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
