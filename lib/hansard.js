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

exports.addSubHeading = function(attrs, cb){
  var query = 'SELECT 1 FROM hansards WHERE id=$1'
  var values = [attrs.id, attrs.date, attrs.html, attrs.headingId];
  db.query(query, [attrs.id], function(err, result){
    var query;
    if (result.rowCount){
      query = "UPDATE hansards SET date=$2, html=$3, major_id = $4 minor=true WHERE id=$1;";
    }else{
      query = "INSERT INTO hansards (id, date, html, major_id, minor) SELECT $1, $2, $3, $4, true";
    }
    db.query(query, values, function(err, result){
      cb(err, result);
    });
  });
};

exports.addSpeech = function(attrs, cb){
  var query = 'SELECT 1 FROM hansards WHERE id=$1'
  var values = [attrs.id, attrs.date, attrs.html, attrs.headingId, attrs.subHeadingId, 
      attrs.speaker_id, attrs.speaker, attrs.time, attrs.words];
  db.query(query, [attrs.id], function(err, result){
    var query;
    if (result.rowCount){
      query = "UPDATE hansards SET date=$2, html=$3, major_id = $4, minor_id = $5, speaker_id = $6" + 
        ", speaker = $7, time = $8, words = $9 WHERE id=$1;";
    }else{
      query = "INSERT INTO hansards (id, date, html, major_id, minor_id, speaker_id, speaker, time, words) " + 
        "SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9";
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
