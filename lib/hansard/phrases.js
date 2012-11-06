var db = require('../db');

exports.bySpeechId = function(speechId, cb){
  var query = 'select * from phrases where hansard_id = $1';
  db.query(query, [speechId], function(err, result){
    if (err) return cb(err);
    cb(null, result.rows);
  });
};
