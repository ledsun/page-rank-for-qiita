const fs = require('fs')
const ensureDirectoryExistence = require('../../ensure-directory-existence')
const readItemWithoutCount = require('./read-item-without-count');
const writeItemsWithoutCount = require('./write-items-without-count')

module.exports = function() {
  ensureDirectoryExistence(`${process.cwd()}/data/`)
  const file = `${process.cwd()}/data/page-rank-for-qiita__items-without-count.text`
  const stream = fs.createWriteStream(file, {
    flags: 'a'
  })
  const [ignoreItems, existEntries] = readItemWithoutCount(file)

  return {
    ignoreItems,
    write(data) {
      writeItemsWithoutCount(existEntries, stream, data)
    },
    end() {
      stream.end()
    }
  }
}
