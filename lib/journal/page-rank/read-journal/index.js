const fs = require('fs')
const es = require('event-stream')
const calculatePageRank = require('../../../calculate-page-rank')
const TagRanking = require('./tag-ranking')
const ItemMap = require('./item-map')

module.exports = function(journalFile) {
  const existEntries = new Set()
  const itemMap = new ItemMap()
  const tagRanking = new TagRanking()

  const s = fs.createReadStream(journalFile, {
      encoding: 'utf8'
    })
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
        s.pause()

        const [url, title, countStr, articleLength, tags, updated_at] = line.split('\t')
        // 文字列で取れるので数値に型変換
        const count = Number(countStr)
        const ratio = calculatePageRank(count, articleLength, updated_at)

        // 稀に空行があるらしい
        if (url) {
          const tagArray = tags.split(',')

          if (ratio) {
            tagRanking.add(url, tagArray)
          }

          if (url) {
            itemMap.set(
              url,
              title,
              count,
              articleLength,
              ratio,
              tagArray,
              updated_at
            )
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
    tagRanking,
    existEntries
  }
}
