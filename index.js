var ipv4 = require('./data/ipv4.json')
var ipv6 = require('./data/ipv6.json')
var ipaddr = require('ipaddr.js')

module.exports = {
  ip2location: function (input) {
    var ip = ipaddr.parse(input)
    var data = []

    if (input.includes('.')) {
      data = ipv4
    }

    if (input.includes(':')) {
      data = ipv6
    }

    var result = data.find(({ cidr }, idx) => {
      return ip.match(ipaddr.parseCIDR(cidr))
    })

    return { ip: input, country: result?.country }
  }
}
