var pg = require('pg');
var util = require('util');
var moment = require('moment');
var Stream = require('stream');

exports.connect = function(cb){
  var connection;
  if (process.env.HEROKU_POSTGRESQL_COPPER_URL){
    connection = process.env.HEROKU_POSTGRESQL_COPPER_URL;
  }else{
    connection = 'tcp://localhost/politalk';
    if (process.env.NODE_ENV){
      connection += '_' + process.env.NODE_ENV;
    }
  }
  exports.client = new pg.Client(connection);
  exports.client.connect();
};

exports.query = function(sql, parameters, cb){
  var start;
  if (!exports.client){
    exports.connect();
  }
  //start = (new Date()).getTime();
  exports.client.query(sql, parameters, function(err, result){
    //var duration = (new Date()).getTime() - start;
    //console.error(duration + ": " + sql);
    cb(err, result);
  });
};

exports.end = function(){
  if (exports.client){
    exports.client.end();
    exports.client = null;
  }
};

exports.createStream = function(sql, parameters){
  if (!exports.client){
    exports.connect();
  }
  var stream = new Stream();
  stream.readable = true;
  var query = exports.client.query(sql, parameters);
  query.on('row', function(row){
    stream.emit('data', row);
  });
  query.on('end', function(){
    stream.emit('end');
  });
  query.on('error', function(err){
    stream.emit('error', err);
  });
  return stream;
};

exports.upsert = function(insert, update, values, cb){
  exports.query(insert, values, function(err, result){
    if (!err) return cb();
    exports.query(update, values, cb);
  });
};

exports.formatDate = function(date){
  return moment(date).format('YYYY-MM-DD');
};
