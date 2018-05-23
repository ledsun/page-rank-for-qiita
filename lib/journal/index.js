const fs = require('fs')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const readItemWithoutCount = require('./read-item-without-count');
const PageRank = require('./page-rank')
const updateMemoryCache = require('./update-memory-cache')
const writeItemsWithoutCount = require('./write-items-without-count')

ensureDirectoryExistence(`${process.cwd()}/data/`)
const itemsWithoutCountFile = `${process.cwd()}/data/page-rank-for-qiita__items-without-count.text`
const fileOption = {
  flags: 'a'
}
const itemsWithoutCountStream = fs.createWriteStream(itemsWithoutCountFile, fileOption)

const pageRank = PageRank()

// サーバ終了時にflashする
process.on('SIGINT', () => {
  console.log(new Date(), 'CLOSING [SIGINT]')
  pageRank.end()
  itemsWithoutCountStream.end()
  process.exit()
})

const existEntries2 = new Set()
const ignoreItems = readItemWithoutCount(itemsWithoutCountFile, existEntries2)

module.exports = {
  itemMap: pageRank.itemMap,
  ignoreItems,
  queryHistories: pageRank.queryHistories,
  write: (data) => {
    updateMemoryCache(pageRank.queryHistories, pageRank.itemMap, data)
    pageRank.write(data)
    writeItemsWithoutCount(existEntries2, itemsWithoutCountStream, data)
  }
}
