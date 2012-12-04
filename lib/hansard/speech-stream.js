var async = require('async');
var db = require('../db');
var Stream = require('stream');

module.exports = function(){
  var stream = new Stream();
  stream.writable = stream.readable = true;
  var speechCount = 0;
  var writeBuffer = 0;
  var ended = false;
  var batch = 10;
  var offset = 0;
  
  // Get results in batches and emit data
  stream._start = function(){
    db.connect();
    var sql = "select count(*) from hansards where major is null and minor is null limit 30";
    db.client.query(sql, function(err, result){
      if (err) return stream.emit('error', err);
      speechCount = result.rows[0].count;
      stream._query();
    }); 
  };

  stream._query = function(){
    var sql = "select * from hansards where major is null and minor is null limit $2 offset $1 ";
    var query;
    if (offset > speechCount){
      return stream.emit('end');
    }
    query = db.client.query(sql, [offset, batch]);
    offset += batch;
    query.on('row', function(row){
      stream.emit('data', row);
    });
    query.on('error', function(err){
      stream.emit('error', err);
    });
    query.on('end', function(err){
      setInterval
    });
  };

  stream.write = function(data){
    writeBuffer++;
    stream._updateObject(data, function(err){
      if (err) return stream.emit('error', err);
      writeBuffer--;
      stream._closeIfEnded();
    });
    return true;
  };

  stream._updateObject = function(data, cb){
    var query = "delete from phrases where hansard_id = $1";
    db.query(query, [data.id], function(err){
      if (err) return cb(err);
      async.forEach(data.keywords, function(keyword, done){
        var query = "INSERT INTO phrases (hansard_id, text, frequency, date) SELECT $1, $2, $3, $4";
        db.query(query, [data.id, keyword.term, keyword.tf, data.date], done);
      }, cb);
    });
  };

  stream._closeIfEnded = function(data){
    if (ended && !writeBuffer){
      console.error('ended!');
      if (db.client){
        db.end();
      }
      stream.emit('close');
    }
  };

  stream.end = function(){
    ended = true;
    stream._closeIfEnded();
  };

  process.nextTick(stream._start);

  return stream;
};


