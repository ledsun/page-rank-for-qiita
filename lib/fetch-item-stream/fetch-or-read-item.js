const fetchItem = require('./fetch-item')
const fs = require('fs')
const path = require('path')

module.exports = async function(ignoreItems, url) {
  if (ignoreItems.has(url)) {
    // すでにカウント数が0だとわかっている
    return ''
  } else {
    try {
      const file = path.join(`${process.cwd()}/data/public/cache`, `${url.replace('https://qiita.com', '')}.html`)
      return fs.readFileSync(file, {
        encoding: 'utf8'
      })
    } catch (e) {
      // キャッシュファイルがなければfetchする
      if (e.code === 'ENOENT') {
        return await fetchItem(url)
      }

      console.error(new Date(), e)
      return ''
    }
  }
}
