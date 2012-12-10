var pg = require('pg');
var util = require('util');
var moment = require('moment');

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
  if (!exports.client){
    exports.connect();
  }
  exports.client.query(sql, parameters, function(err, result){
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
  var stream;
  if (!exports.client){
    exports.connect();
  }
  stream = exports.client.query(sql, parameters);
  stream.on('row', function(row){
    stream.emit('data', row);
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
