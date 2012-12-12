var db = require('./db');
var _ = require('lodash');
var async = require('async');
var es = require('event-stream');
var members = require('./members');
var keywords = require('./keywords');
var dates = require('./dates');
var url = require('url');

// Set etag based of the cached results
exports.middleware = function(){
  return function(req, res, next) {
    var etag = req.headers['if-none-match'];
    var uri = url.parse(req.url, true);
    var path = uri.pathname;
    var matchesApiEndPoint = path.match(/\/api\/(.*)/i);
    getSummary(function(err, summary){
      if (!summary) return next();
      var expectedEtag = summary.version + ' - ' + summary.time.toLocaleString();
      var useEndPointCache = process.env.NODE_ENV !== 'test' &&
        matchesApiEndPoint && 
        _.isEmpty(uri.query) && 
        summary &&
        summary[matchesApiEndPoint[1]];

      if (err) return next(err);
      if (expectedEtag === etag){
        res.send(304);
      }else{ 
        res.set('ETag', expectedEtag);
        
        // If the api has been submitted with no query parameters, check to see
        // if this endpoint is cached on the summary data
        if (useEndPointCache){
          res.set('Content-Type', 'application/json; charset=utf-8');
          res.set('X-Cached-Endpoint', 'true');
          return res.send(summary[matchesApiEndPoint[1]]);
        }else{
          next();
        }
      }
    });
  };
};

function getSummary(cb){
  var query = "select * from summaries limit 1";
  db.query(query, [], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows[0]);
  });
}

module.exports.rebuildStream = function(path){

  return es.through(

    function write(data){
      newData = true;
      this.emit('data', data);
    },
    
    function end(){
      var _this = this;
      if (!newData) return this.emit('end');

      async.parallel([
        members.find,
        keywords.find,
        dates.find
      ], function(err, data){
        var insert = 'insert into summaries (time, members, keywords, dates) values (current_timestamp, $1, $2, $3)';
        var update = 'update summaries set time=current_timestamp, members=$1, keywords=$2, dates=$3';
        var values = _.map(data, JSON.stringify);
        db.upsert(insert, update, values, function(err){
          if (err) return _this.emit('error', err);
          _this.emit('end');
        });
      });
    }

  );
};
