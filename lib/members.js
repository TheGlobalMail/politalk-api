var request = require('request');
var Stream = require('stream');
var util = require('util');
var moment = require('moment');
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
    "where year between $1 and $2 " + 
    "group by speaker_id,speaker,person_id,party,house,first_name,last_name,image, " + 
    "entered_house, left_house, left_reason,constituency " +
    "order by sum(duration) desc";
  var values = [dates.getFromYear(from), dates.getToYear(to)];

  db.query(query, values, function(err, result) {
    var members;
    if (err) return cb(err);
    members = result.rows;
    _.each(members, function(member, index){
      member.id = member.speaker_id;
      member.rank = index + 1;
      member.dates = [];
      member.durations = [];
      member.url = [
        openAuUrl,
        member.house === 1 ? 'mp' : 'senator',
        [member.first_name, member.last_name].join('_'),
        member.constituency.replace(/[^a-z]/mi, '_')
      ].join('/').toLowerCase();
    });
    cb(err, members);
  });
};

exports.createStream = function(cb){
  var sql = 'select * from member order by person_id;';
  db.createStream(sql, [], cb);
};


exports.findByYear = function(year, cb){
  var sql = 'select data from members_by_year_cache where year = $1';
  db.query(sql, [year], function(err, results){
    if (err) return cb(err); 
    cb(null, results.rowCount ? results.rows[0].data : []);
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
