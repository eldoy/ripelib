var ipaddr = require('ipaddr.js')

function chunkify(array, size) {
  var chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

module.exports = {
  ip2location: function (input) {
    var ip = ipaddr.parse(input)
    var data = []
    var delimiter

    if (input.includes('.')) {
      delimiter = '.'
      data = require('./data/ipv4.json')
    }

    if (input.includes(':')) {
      delimiter = ':'
      data = require('./data/ipv6.json')
    }

    var octet = input.split(delimiter)[0]

    var result = chunkify(data, 50)
      .filter((entry) => {
        entry = [...new Set(entry.map(({ from }) => from.split(delimiter)[0]))]
        return entry.includes(octet)
      })
      .flatMap((entry) => entry)
      .find(({ cidr }) => {
        return ip.match(ipaddr.parseCIDR(cidr))
      })

    return { ip: input, country: result?.country }
  }
}
