var db = require('./db');

// Set etag based of the cached results
exports.middleware = function(){
  return function(req, res, next) {
    var etag = req.headers['if-none-match'];
    getLastDownloaded(function(err, time){
      var expectedEtag = time;
      if (err) return next(err);
      if (expectedEtag === etag){
        res.send(304);
      }else{
        res.set('ETag', expectedEtag);
        next();
      }
    });
  };
};

function getLastDownloaded(cb){
  var query = "select time from summaries limit 1";
  db.query(query, [], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows[0].time.toLocaleString());
  });
}

