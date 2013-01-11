var cache = require('./lib/cache');
var stream = cache.rebuildStream();
stream.write("something");
stream.end();
stream.on('end', function(){
  process.exit(0);
});
