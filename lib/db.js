var pg = require('pg');
var util = require('util');
var moment = require('moment');
var Stream = require('stream');
var _ = require('lodash');

exports.usingSlaves = false;
exports.slaves = [];

exports.connect = function(cb){
  var connection, slaves;
  if (process.env.DATABASE_URL){
    connection = process.env.DATABASE_URL;
  }else{
    connection = 'tcp://localhost/politalk';
    if (process.env.NODE_ENV){
      connection += '_' + process.env.NODE_ENV;
    }
  }
  exports.client = new pg.Client(connection);
  exports.client.connect();
  if (process.env.SLAVES){
    slaves = process.env.SLAVES.split(',');
    _.each(slaves, exports.connectSlaves);
    if (slaves.length){
      console.error('SLAVES: Using ' + slaves.length + ' slaves (' + slaves.join(',') + ')');
      exports.usingSlaves = true;
    }
  }
};

exports.connectSlaves = function(slaveUrl){
  var client = new pg.Client(slaveUrl);
  client.connect();
  exports.slaves.push(client);
}

exports.query = function(sql, parameters, cb){
  if (!exports.client){
    exports.connect();
  }
  exports.client.query(sql, parameters, cb); 
};

exports.readonlyQuery = function(sql, parameters, cb){
  var slave;
  if (!exports.client){
    exports.connect();
  }
  if (!exports.usingSlaves){
    exports.client.query(sql, parameters, cb); 
  }else{
    slave = exports.chooseSlave();
    slave.query(sql, parameters, cb);
  }
};

exports.chooseSlave = function(){
  var slaveIndex;
  slaveIndex = _.random(0, exports.slaves.length - 1);
  return exports.slaves[slaveIndex];
};

exports.end = function(){
  if (exports.client){
    exports.client.end();
    exports.client = null;
  }
  if (exports.slaves){
    _.each(exports.slaves, function(slave){
      slave.end();
    });
    exports.slaves = [];
  }
};

exports.createStream = function(sql, parameters){
  var query;
  if (!exports.client){
    exports.connect();
  }
  var stream = new Stream();
  stream.readable = true;
  if (exports.usingSlaves){
    query = exports.chooseSlave().query(sql, parameters);
  }else{
    query = exports.client.query(sql, parameters);
  }
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

exports.isWritingQuery = function(sql){
  return sql.match(/^(update|insert|delete)/, 'i')
}

exports.formatDate = function(date){
  return moment(date).format('YYYY-MM-DD');
};
