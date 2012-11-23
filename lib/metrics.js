if (process.env.NODE_ENV === 'production'){
  modules.exports = require('nodetime').profile({
    accountKey: process.env.NODETIME_KEY, 
    appName: 'politalk-api'
  });
}
