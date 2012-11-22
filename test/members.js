var test = require('tap').test;
var MembersStream = require('../lib/members').MembersStream;
var http = require('http');
// Uncomment to test on the real api. Note: you'll need an api key
var url = 'http://localhost:1337';

test("emits an object for each member in the house and senate", function(t){
  var server = setupServer();
  var members = [];

  var stream = new MembersStream({ url: url, apikey: 'test' });
  stream.on('data', function(data){
    members.push(data);
  });
  stream.on('end', function(){
    t.ok(members.length === 4);
    server.close(function(){
      t.end();
    });
  });
});

function setupServer(){
  var members = [{"person_id":"100001"}, {"person_id":"100002"}];
  // Stub api calls
  return http.createServer(function (req, res) {
    if (req.url.match(/getRepresentatives|getSenators/)){
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(members));
    }else{
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify([{ person_id: req.url.match(/id=(\d+)/)[1] }]));
    }
  }).listen(1337);
}
