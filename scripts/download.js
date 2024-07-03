var dugg = require('dugg')()
var extras = require('extras')
var fs = require('fs')
var iso31661 = import('iso-3166').then(({ iso31661 }) => iso31661)

function toCidr(value) {
  return Math.round(-1 * Math.log2(value - 2) + 32)
}

function parse(filename) {
  var rir = filename.split('-')[1]
  var data = fs.readFileSync(filename, 'utf8')

  var rows = data
    .split('\n')
    .filter(
      (v) =>
        v.startsWith(rir) && !v.startsWith(rir + '|*|') && !v.includes('|asn|')
    )

  return rows
    .map((row) => {
      var [source, countryCode, type, from, size, date, status] = row.split('|')

      var cidr

      if (type == 'ipv4') {
        cidr = from + '/' + toCidr(size)
      } else if (type == 'ipv6') {
        cidr = from + '/' + size
      }

      var { name: country } =
        iso31661.find((iso) => iso.alpha2 == countryCode) || {}

      return {
        source,
        countryCode,
        country,
        type,
        cidr,
        from,
        size,
        date,
        status
      }
    })
    .filter(({ source }) => !!source)
}

async function download({ url, parse }) {
  var filename = './data/' + url.split('/').at(-1)

  await dugg.download(url, filename, { quiet: false })

  var entries = parse(filename)

  fs.writeFileSync(`${filename}.json`, JSON.stringify(entries, null, 2))
}

var rirs = ['afrinic', 'apnic', 'arin', 'lacnic', 'ripencc']

async function run() {
  iso31661 = await iso31661

  extras.run(`rm -rf ./data/*`)

  await Promise.all(
    rirs.map((rir) => {
      return download({
        url: `https://ftp.ripe.net/pub/stats/${rir}/delegated-${rir}-extended-latest`,
        parse
      })
    })
  )

  var ips = rirs.map((rir) => {
    var data = require(`../data/delegated-${rir}-extended-latest.json`)
    return data
  })

  console.log({
    ips: ips.map((rir) => ({
      rir: rir[0]?.source,
      asn: rir.filter(({ type }) => type == 'asn').length,
      ipv4: rir.filter(({ type }) => type == 'ipv4').length,
      ipv6: rir.filter(({ type }) => type == 'ipv6').length
    }))
  })

  ips = ips.flatMap((ip) => ip).sort((a, b) => a.from - b.from)
  var ipv4 = ips.filter(({ type }) => type == 'ipv4')
  var ipv6 = ips.filter(({ type }) => type == 'ipv6')

  fs.writeFileSync(`./data/ipv4.json`, JSON.stringify(ipv4, null, 2))
  fs.writeFileSync(`./data/ipv6.json`, JSON.stringify(ipv6, null, 2))
  fs.writeFileSync(`./data/iso31661.json`, JSON.stringify(iso31661, null, 2))
}

run()
