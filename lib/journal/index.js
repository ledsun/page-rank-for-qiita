const fs = require('fs')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const readJournal = require('./read-journal')
const readItemWithoutCount = require('./read-item-without-count');
const updateMemoryCache = require('./update-memory-cache')
const writeJournal = require('./write-journal')
const writeItemsWithoutCount = require('./write-items-without-count')

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

const existEntries = new Set()
const {
  itemMap,
  queryHistories
} = readJournal(journalFile, existEntries)
const ignoreItems = readItemWithoutCount(itemsWithoutCountFile, existEntries)

module.exports = {
  itemMap,
  ignoreItems,
  queryHistories,
  write: (data) => {
    updateMemoryCache(queryHistories, itemMap, data)
    writeJournal(existEntries, journalStream, data)
    writeItemsWithoutCount(existEntries, itemsWithoutCountStream, data)
  }
}
