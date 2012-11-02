var pg = require('pg');
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
  exports.client.query(sql, parameters, function(err, result){
    cb(err, result);
  });
};

exports.end = function(){
  if (exports.client){
    exports.client.end();
  }
}
