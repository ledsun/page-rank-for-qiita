const fs = require('fs')
const es = require('event-stream')

module.exports = function(itemsWithoutCountFile, existEntries) {
  const ignoreItems = new Set()

  const s = fs.createReadStream(itemsWithoutCountFile, {
      encoding: 'utf8'
    })
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
        s.pause()

        const url = line
        ignoreItems.add(url)
        existEntries.add(url)

        // resume the readstream, possibly from a callback
        s.resume()
      })
      .on('error', (err) => console.log(new Date(), 'Error while reading file.', err))
      .on('end', () => console.log(new Date(), 'Read items-without-count file.', ignoreItems.size))
    )

  return ignoreItems
}
