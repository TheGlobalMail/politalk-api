var es = require('event-stream');
var nodetime;
var appName;

if (process.env.NODE_ENV === 'production'){
  if (process.env.ENABLE_WORDCHOICES){
    appName = 'partylines-api';
  }else{
    appName = 'politalk-api';
  }
  console.error('nodetime enabled..');
  nodetime = require('nodetime');
  nodetime.profile({
    //headless: false,
    //stdout: true,
    silent: true,
    accountKey: process.env.NODETIME_KEY, 
    appName: appName 
  });
  exports.nodetime = nodetime;

  process.on('uncaughtException', function(err){
    exports.end(function(){
      process.exit(1);
    });
  });

}


exports.end = function(cb){
  if (nodetime){
    setTimeout(function(){
      nodetime.destroy();
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
