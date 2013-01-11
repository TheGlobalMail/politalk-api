var es = require('event-stream');
var request = require('request');

module.exports =  es.map(function(data, cb){
  //var url = 'http://data.openaustralia.org/members/images/mpsL/' + data.person_id + ".jpg";
  var url = 'http://politalk.herokuapp.com/modules/members/members-img/mpsL/' + data.person_id + '.jpg';
  request(url, function(err, res){
    if (!err && res.statusCode == 200){
      data.image = url;
    }else{
      data.image = null;
    }
    cb(null, data);
  });
});
