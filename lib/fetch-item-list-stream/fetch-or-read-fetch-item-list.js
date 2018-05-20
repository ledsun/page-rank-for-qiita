const fs = require('fs')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const toQuery = require('./to-query')
const fetchItemList = require('./fetch-item-list')

module.exports = function(tag, page) {
  const query = toQuery(tag)
  const file = `${process.cwd()}/data/page-rank-for-qiita__fetch-item-list/${query}/${page}/items.json`
  ensureDirectoryExistence(file)

  return new Promise((resolve, reject) => {
    fs.readFile(file, async (err, data) => {
      // キャッシュが読めた
      if (!err) {
        resolve(JSON.parse(data))
      }

      if (err) {
        // キャッシュファイルがなければfetchする
        if (err.code === 'ENOENT') {
          try {
            items = await fetchItemList(tag, page, 100)
            writeFile(file, items)
            resolve(items)
          } catch (e) {
            reject(e)
          }
        } else {
          reject(err)
        }
      }
    })
  })
}

function writeFile(file, items) {
  // ファイルへの書き込みは待たなくて良い
  fs.writeFile(file, JSON.stringify(items), (err) => {
    if (err) console.error(new Date(), err)
  })
}
