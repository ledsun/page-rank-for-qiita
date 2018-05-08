const fs = require('fs')
const es = require('event-stream')
const QueryHistories = require('./query-histories')
const ItemMap = require('./item-map')

module.exports = function(file) {
  const itemMap = new ItemMap()
  const queryHistories = new QueryHistories()
  const existEntries = new Set()

  const s = fs.createReadStream(file, {
      encoding: 'utf8'
    })
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
        s.pause()

        const [url, title, count, content_length, tags, created_at, updated_at] = line.split('\t')
        // 稀に空行があるらしい
        if (url) {
          const tagArray = tags.split(',')

          if (Number(count)) {
            queryHistories.add(url, tagArray)
          }

          if (url) {
            itemMap.set(url, title, count, content_length, tagArray, updated_at)
          }

          existEntries.add(`${url}`)
        }

        // resume the readstream, possibly from a callback
        s.resume()
      })
      .on('error', (err) => console.log(new Date(), 'Error while reading file.', err))
      .on('end', () => console.log(new Date(), 'Read journal file.'))
    )

  return {
    itemMap,
    queryHistories,
    existEntries
  }
}
