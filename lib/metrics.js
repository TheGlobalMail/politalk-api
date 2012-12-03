var es = require('event-stream');
var nodetime;

if (process.env.NODE_ENV === 'production'){
  nodetime = require('nodetime');
  nodetime.profile({
    //headless: false,
    //stdout: true,
    silent: true,
    accountKey: process.env.NODETIME_KEY, 
    appName: 'politalk-api'
  });
  exports.nodetime = nodetime;
}

exports.end = function(cb){
  if (nodetime){
    setTimeout(function(){
      cb();
    }, 62000);
  }else{
    cb();
  }
};

exports.streamCounter = function(label){
  return es.through(function write(data){
    if (nodetime){
      if (!this.counter) this.counter = 0;
      this.counter++;
    }
    this.emit('data', data);
  }, function end(){
    if (nodetime){
      nodetime.metric('politalk-api', label, this.counter, null, 'sum');
    }
    this.emit('end');
  });
};
