var db = require('./db');
var _ = require('lodash');
var async = require('async');
var es = require('event-stream');
var members = require('./members');
var moment = require('moment');
var keywords = require('./keywords');
var dates = require('./dates');
var url = require('url');
var jsonp = require('./jsonp');
var wordchoices = require('./wordchoices');

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
          (_.isEmpty(uri.query) || matchesApiEndPoint[1] === 'weeks') &&
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
            return jsonp.send(req, res, summary[matchesApiEndPoint[1]]);
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
  var term = termRegex && decodeURIComponent(termRegex[1].toLowerCase());
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
      this.newData = true;
      this.emit('data', data);
    },
    
    function end(){
      var _this = this;
      if (!this.newData) return this.emit('end');

      async.parallel([
        members.find,
        keywords.find,
        dates.find,
        dates.weeks
      ], function(err, data){
        var update = 'update summaries set time=current_timestamp, members=$1, keywords=$2, dates=$3, weeks=$4';
        var values = _.map(data, JSON.stringify);
        db.query(update, values, function(err){
          if (err) return _this.emit('error', err);
          _this.emit('end');
        });
      });
    }

  );
};

module.exports.rebuildMembersCache = function(path){

  return es.through(

    function write(data){
      this.newData = true;
      this.emit('data', data);
    },
    
    function end(){
      var _this = this;
      if (!this.newData) return this.emit('end');

      dates.find(function(err, dates){

        var years = _.chain(dates)
          .map(function(d){ return d.getFullYear(); })
          .uniq()
          .value();

        async.forEachSeries(years, function(year, done){
          var startOfYear = new Date(year, 0, 1);
          var endOfYear = moment(new Date(startOfYear)).add('y', 1);
          members.find(startOfYear, endOfYear, function(err, results){
            var insert = "insert into members_by_year_cache (lastupdate, year, data) values (current_timestamp, $1, $2)";
            var update = 'update members_by_year_cache set lastupdate=current_timestamp, data=$2 where year = $1';
            var values = [year, JSON.stringify(results)];
            db.upsert(insert, update, values, done);
          });
        }, function(err){
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

exports.rebuildCacheStream = function(){
  var updated = false;
  return es.through(
    function write(data){
      updated = true;
      this.emit('data', data);
    },
    function end(){
      var stream = this;
      if (!updated){
        if (process.env.VERBOSE){
          console.error("DOWNLOADER: No data. Skipping wordchoices_cache rebuild");
        }
        return this.emit('end');
      }
      if (process.env.VERBOSE){
        console.error("DOWNLOADER: Starting wordchoices_cache rebuild");
      }
      db.query('select * from wordchoices_cache', function(err, result){
        if (err) return cb(err);
        async.forEachSeries(result.rows, function(row, done){
          wordchoices.forTerm(row.term, !!row.exactmatch, function(err, data){ 
            if (err) return done(err);
            updateCachedWordChoicesData(row.term, row.exactmatch, data, done);
          });
        }, function(err){
          if (err) return stream.emit('error', err);
          if (process.env.VERBOSE){
            console.error("DOWNLOADER: wordchoices_cache rebuilt " + result.rowCount);
          }
          stream.emit('end');
        });
      });
    }
  );
};

function updateCachedWordChoicesData(term, exactMatch, data, cb){
  var sql = "update wordchoices_cache " +
    "set data = $1, time = $2, resultCount = $3, toomany = $4 " +
    "where term = $5 and exactMatch = $6";
  db.query(sql, [JSON.stringify(data), new Date(), data.data.length, !!data.tooMany, term, exactMatch], cb);
}
