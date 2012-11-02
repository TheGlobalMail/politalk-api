var db = require('./db');

exports.Parser = require('./hansard/parser').Parser;

exports.addHeading = function(attrs, cb){
  var query = 'SELECT 1 FROM hansards WHERE id=$1'
  var values = [attrs.id, attrs.date, attrs.html];
  db.query(query, [attrs.id], function(err, result){
    var query;
    if (result.rowCount){
      query = "UPDATE hansards SET date=$2, html=$3, major=true WHERE id=$1;";
    }else{
      query = "INSERT INTO hansards (id, date, html, major) SELECT $1, $2, $3, true";
    }
    db.query(query, values, function(err, result){
      cb(err, result);
    });
  });
};

exports.byId = function(id, cb){
  var sql = 'select * from hansards where id = $1';
  db.query(sql, [id], function(err, result){
    if (err) return cb(err);
    cb(err, result.rows[0]);
  });
};
