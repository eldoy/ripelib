var data = require('./data/ripencc-latest.json')

function normalize(str, type) {
  var delimiter = type == 'ipv4' ? '.' : ':'
  var size = type == 'ipv4' ? 3 : 4

  return str.split(delimiter).map((i) => {
    if (i.length != size) {
      var arr = Array(size - i.length).fill(0)
      return [...arr, i].join('')
    }
    return i
  })
}

module.exports = {
  ip2location: function (input) {
    var ip

    var inputType = 'asn'
    if (input.includes('.')) inputType = 'ipv4'
    if (input.includes(':')) inputType = 'ipv6'

    var result = data
      .filter(({ type }) => type == inputType)
      .find(({ type, from, to }) => {
        ip = normalize(input, inputType)
        from = normalize(from, type)
        to = normalize(to, type)
        return ip >= from && ip < to
      })

    return { ip: input, country: result?.country }
  }
}
