var request = require('request');
var async = require('async');
var _ = require('lodash');
var map = require('map-stream');

// Through stream that reads from a stream that emits data with the keys `date`
// and `url` and then writes out data with keys `date` and `xml` which is the
// xml downloaded form the url
module.exports = map(function(data, cb){
  var self = this;
  request(data.url, function (err, response, body){
    if (err) return cb(err);
    if (response.statusCode != 200 && response.statusCode != 404) return cb('Error status code: ' + response.statusCode + ' on ' + debateUrl);
    if (response.statusCode == 200){
      cb(null, {date: data.date, xml: body});
    }
  });
});
