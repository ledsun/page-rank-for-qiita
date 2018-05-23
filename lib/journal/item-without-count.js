const fs = require('fs')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const readItemWithoutCount = require('./read-item-without-count');
const writeItemsWithoutCount = require('./write-items-without-count')

module.exports = function() {
  ensureDirectoryExistence(`${process.cwd()}/data/`)
  const itemsWithoutCountFile = `${process.cwd()}/data/page-rank-for-qiita__items-without-count.text`
  const fileOption = {
    flags: 'a'
  }
  const itemsWithoutCountStream = fs.createWriteStream(itemsWithoutCountFile, fileOption)
  const existEntries2 = new Set()
  const ignoreItems = readItemWithoutCount(itemsWithoutCountFile, existEntries2)

  return {
    ignoreItems,
    write(data) {
      writeItemsWithoutCount(existEntries2, itemsWithoutCountStream, data)
    },
    end() {
      itemsWithoutCountStream.end()
    }
  }
}
