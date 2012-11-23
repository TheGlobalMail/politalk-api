var db = require('./db');
var es = require('event-stream');
var fs = require('fs');

var newData = false;

module.exports = es.through(

  function write(data){
    newData = true;
    this.emit('data', data);
  },
  
  function end(){
    var _this = this;
    if (!newData) return this.emit('end');
    fs.readFile(__dirname + '/../db/phrases_summaries.sql', function(err, sql){
      if (err) return _this.emit('error', err);
      db.query(sql.toString(), function(err){
        if (err) return _this.emit('error', err);
        _this.emit('end');
      });
    });
  }

);
