var db = require('../db');

exports.bySpeechId = function(speechId, cb){
  var query = 'select * from phrases where hansard_id = $1';
  db.query(query, [speechId], function(err, result){
    if (err) return cb(err);
    cb(null, result.rows);
  });
};

exports.clear = function(cb){
  if (process.env.NODE_ENV !== 'test'){
    console.error('Hansard.Phrases.clear ignored because not in test');
    return cb();
  }
  db.query('delete from phrases', cb);
};
