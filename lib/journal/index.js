const PageRank = require('./page-rank')
const ItemWithoutCount = require('./item-without-count')
const updateMemoryCache = require('./update-memory-cache')

const pageRank = PageRank()
const itemsWithoutCount = ItemWithoutCount()

// サーバ終了時にflashする
process.on('SIGINT', () => {
  console.log(new Date(), 'CLOSING [SIGINT]')
  pageRank.end()
  itemsWithoutCount.end()
  process.exit()
})

module.exports = {
  itemMap: pageRank.itemMap,
  tagRanking: pageRank.tagRanking,
  ignoreItems: itemsWithoutCount.ignoreItems,
  write: (data) => {
    updateMemoryCache(pageRank.tagRanking, pageRank.itemMap, data)
    pageRank.write(data)
    itemsWithoutCount.write(data)
  }
}
