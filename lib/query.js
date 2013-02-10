var db = require('./db');
var es = require('event-stream');
var fs = require('fs');

module.exports.createStream = function(path){

  path = __dirname + '/../' + path;

  return es.through(

    function write(data){
      this.newData = true;
      this.emit('data', data);
    },
    
    function end(){
      var _this = this;
      if (!this.newData) return this.emit('end');
      fs.readFile(path, function(err, sql){
        if (err) return _this.emit('error', err);
        db.query(sql.toString(), function(err){
          if (err) return _this.emit('error', err);
          _this.emit('end');
        });
      });
    }

  );
};
