if (process.env.NODE_ENV === 'production'){
  module.exports = require('nodetime').profile({
    accountKey: process.env.NODETIME_KEY, 
    appName: 'politalk-api'
  });
}
