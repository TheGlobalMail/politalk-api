var pg = require('pg').native;
var util = require('util');

exports.connect = function(cb){
  var connection = 'tcp://localhost/politalk';
  if (process.env.NODE_ENV){
    connection += '_' + process.env.NODE_ENV;
  }
  exports.client = new pg.Client(connection);
  exports.client.connect();
};

exports.query = function(sql, parameters, cb){
  if (!exports.client){
    exports.connect();
  }
  exports.client.query(sql, parameters, cb);
};

/*
exports.query = function(sql, parameters, cb){
  var query;
  if (!exports.client){
    console.log('connecting..');
    exports.connect(function(err, client){
      if (err) return cb(err);
      console.log('query with');
      client.query(sql, parameters, cb);
    });
  }else{
    console.log('query without connect');
    client.query(sql, parameters, cb);
  }
};
*/
