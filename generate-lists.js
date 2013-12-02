var db = require('./lib/db');
var keywords = require('./lib/keywords');

keywords.generateLists(function(err){
  console.error('done');
  db.end();
  console.log(err);
});
