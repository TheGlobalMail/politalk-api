var db = require('./db');

exports.Parser = require('./hansard/parser').Parser;

exports.byId = function(id, cb){
  var sql = 'select * from hansards where id = $1';
  db.query(sql, function(err, result){
    cb(err, result && result.rows[0]);
  });
};
