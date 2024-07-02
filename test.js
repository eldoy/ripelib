var ripe = require('./index.js')

var ip = '89.115.187.83'
//var ip = '2001:818:dcd4:c100:3139:b31a:7fe8:3eba'

var location = ripe.ip2location(ip)
console.log(location)
