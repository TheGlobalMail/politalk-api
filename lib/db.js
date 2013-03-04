var pg = require('pg');
var util = require('util');
var moment = require('moment');
var Stream = require('stream');
var _ = require('lodash');
var testTimeout;

exports.connect = function(cb){
  var connection;
  if (process.env.DATABASE_URL){
    connection = process.env.DATABASE_URL;
  }else{
    connection = 'tcp://localhost/politalk';
    if (process.env.NODE_ENV){
      connection += '_' + process.env.NODE_ENV;
    }
  }
  if (process.env.NODE_ENV === 'test' && !testTimeout){
    testTimeout = setTimeout(function(){
      pg.end();
    }, 10000);
  }
  pg.connect(connection, cb);
};

exports.query = function(sql, parameters, cb){
  exports.connect(function(err, client, done){
    var callback, params, query;
    if (err) return cb(err);
    if (!cb){
      callback = parameters;
      params = null;
    }else{
      callback = cb;
      params = parameters;
    }
    query = client.query(sql, params, function(err, result){
      done();
      callback(err, result);
    });
  });
};

exports.readonlyQuery = function(sql, parameters, cb){
  exports.query(sql, parameters, cb); 
};

exports.end = function(){
  //pg.end();
};

exports.createStream = function(sql, parameters, cb){
  var query;
  exports.connect(function(err, client, done){
    var stream = new Stream();
    stream.readable = true;
    query = client.query(sql, parameters);
    query.on('row', function(row){
      stream.emit('data', row);
    });
    query.on('end', function(){
      done();
      stream.emit('end');
    });
    query.on('error', function(err){
      done();
      stream.emit('error', err);
    });
    cb(null, stream);
  });
};

exports.upsert = function(insert, update, values, cb){
  exports.query(insert, values, function(err, result){
    if (!err) return cb();
    exports.query(update, values, cb);
  });
};

exports.isWritingQuery = function(sql){
  return sql.match(/^(update|insert|delete)/, 'i');
};

exports.formatDate = function(date){
  return moment(date).format('YYYY-MM-DD');
};
