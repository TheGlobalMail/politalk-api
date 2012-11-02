db = require('../lib/db');

exports.clearHansard = function(cb){
  db.query('delete from hansards', [], cb);
};

exports.cleanup = function(){
  db.end();
};
