const fs = require('fs')
const read = require('./read')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const updateMemoryCache = require('./update-memory-cache')
const writeFile = require('./write-file')

ensureDirectoryExistence(`${process.cwd()}/data/`)
const journalFile = `${process.cwd()}/data/page-rank-for-qiita__page-rank.tsv`
const itemsWithoutCountFile = `${process.cwd()}/data/page-rank-for-qiita__items-without-count.text`
const fileOption = {
  flags: 'a'
}
const journalStream = fs.createWriteStream(journalFile, fileOption)
const itemsWithoutCountStream = fs.createWriteStream(itemsWithoutCountFile, fileOption)

// サーバ終了時にflashする
process.on('SIGINT', () => {
  console.log(new Date(), 'CLOSING [SIGINT]')
  journalStream.end()
  itemsWithoutCountStream.end()
  process.exit()
})

const {
  itemMap,
  ignoreItems,
  queryHistories,
  existEntries,
} = read(journalFile, itemsWithoutCountFile)

module.exports = {
  itemMap,
  ignoreItems,
  queryHistories,
  write: (data) => {
    updateMemoryCache(queryHistories, itemMap, data)
    writeFile(existEntries, journalStream, itemsWithoutCountStream, data)
  }
}
