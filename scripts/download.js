var dugg = require('dugg')()
var extras = require('extras')
var fs = require('fs')

function parseRipeNcc(filename) {
  var data = fs.readFileSync(filename, 'utf8')

  var rows = data.split('\n')
  rows = rows.slice(4, rows.length)

  return rows
    .map((row, idx) => {
      var [source, country, type, from, size, date, status] = row.split('|')
      var to = rows[idx + 1]?.split('|')[3]

      return { source, country, type, from, to, size, date, status }
    })
    .filter(({ source }) => !!source)
}

function parseGeoLocations(filename) {
  extras.get(`bzip2 -d ${filename}`)

  var data = fs.readFileSync(`${filename}.out`, 'utf8')

  var rows = data.split('\n')

  return rows.map((row, idx) => {
    var [
      cidr,
      id,
      county,
      city,
      country,
      country_code1,
      country_code2,
      ...coordinates
    ] = row.split(',')

    var type
    if (cidr.includes('.')) type = 'ipv4'
    if (cidr.includes(':')) type = 'ipv6'

    return {
      cidr,
      id,
      county,
      city,
      country,
      country_code1,
      country_code2,
      type
    }
  })
}

async function download({ url, parse }) {
  var filename = './data/' + url.split('/').at(-1)

  await dugg.download(url, filename, { quiet: false })

  var entries = parse(filename)

  fs.writeFileSync(`${filename}.json`, JSON.stringify(entries, null, 2))
}

async function run() {
  extras.run(`rm -rf ./data/*`)

  await download({
    url: 'https://ftp.ripe.net/pub/stats/ripencc/delegated-ripencc-latest',
    parse: parseRipeNcc
  })

  await download({
    url: 'https://ftp.ripe.net/ripe/ipmap/geolocations-latest',
    parse: parseGeoLocations
  })
}

run()
