var ripe = require('./index.js')

var ip = '182.50.176.0'
// var ip = '103.174.156.184'

console.time('time')
var location = ripe.ip2location(ip)
console.log(location)
console.timeEnd('time')
