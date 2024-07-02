var dugg = require('dugg')()
var fs = require('fs')

var url = 'https://ftp.ripe.net/pub/stats/ripencc/delegated-ripencc-latest'
var filename = './data/ripencc-latest'

async function download() {
  await dugg.download(url, filename, { quiet: false })

  var data = fs.readFileSync(filename, 'utf8')

  var rows = data.split('\n')
  rows = rows.slice(4, rows.length)

  var entries = rows
    .map((row, idx) => {
      var [source, country, type, from, size, date, status] = row.split('|')
      var to = rows[idx + 1]?.split('|')[3]

      return { source, country, type, from, to, size, date, status }
    })
    .filter(({ source }) => !!source)

  fs.writeFileSync(`${filename}.json`, JSON.stringify(entries, null, 2))
}

download()
