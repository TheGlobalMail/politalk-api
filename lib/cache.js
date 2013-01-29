var db = require('./db');
var _ = require('lodash');
var async = require('async');
var es = require('event-stream');
var members = require('./members');
var keywords = require('./keywords');
var dates = require('./dates');
var url = require('url');
var jsonp = require('./jsonp');

// Set etag based of the cached results
exports.middleware = function(){
  return function(req, res, next) {
    var etag = req.headers['if-none-match'];
    var uri = url.parse(req.url, true);
    var path = uri.pathname;
    var matchesApiEndPoint = path.match(/\/api\/(.*)/i);
    var wordchoicesApi = path.match(/\/api\/wordchoices/);
    if (wordchoicesApi){
      checkWordChoicesCache(req, res, next);
    }else{
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
    }
  };
};

function checkWordChoicesCache(req, res, next){
  var termRegex = req.url.match(/\/api\/wordchoices\/term\/([^?#&]*)/i);
  var term = termRegex && termRegex[1].toLowerCase();
  var exactMatch = !!req.query.c;

  var query = "select * from wordchoices_cache where term = $1 and exactMatch = $2 limit 1";
  db.query(query, [term, exactMatch], function(err, result){
    var cache, json;
    if (err) return next(err);
    if (!result.rowCount){
      next();
    }else{
      res.set('X-Cached-WordChoice', '1');
      cache = result.rows[0];
      jsonp.send(req, res, cache.data);
      updateCachedWordChoices(term, exactMatch, cache.requested, function(){});
    }
  });

}

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
        var update = 'update summaries set time=current_timestamp, members=$1, keywords=$2, dates=$3';
        var values = _.map(data, JSON.stringify);
        db.query(update, values, function(err){
          if (err) return _this.emit('error', err);
          _this.emit('end');
        });
      });
    }

  );
};

exports.cacheWordchoices = function(term, exactMatch, data, cb){
  var sql = "insert into wordchoices_cache " +
    "(term, exactMatch, time, requested, tooMany, resultCount, data) " +
     "values ($1, $2, $3, $4, $5, $6, $7)";
  db.query(sql, [term, !!exactMatch, new Date(), 1, !!data.tooMany, data.data.length, JSON.stringify(data)], cb);
};

function updateCachedWordChoices(term, exactMatch, previousCount, cb){
  var sql = "update wordchoices_cache " +
    "set requested = $1 " +
    "where term = $2 and exactMatch = $3";
  db.query(sql, [previousCount + 1, term, exactMatch], cb);
}
