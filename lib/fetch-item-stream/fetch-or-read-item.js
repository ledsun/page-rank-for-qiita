const fetchItem = require('./fetch-item')
const fs = require('fs')
const path = require('path')

module.exports = async function(ignoreItems, url) {
  if (ignoreItems.has(url)) {
    // すでにカウント数が0だとわかっている
    return {
      body: ''
    }
  } else {
    try {
      const file = path.join(`${process.cwd()}/data/public/cache`, `${url.replace('https://qiita.com', '')}.html`)
      return {
        body: fs.readFileSync(file, {
          encoding: 'utf8'
        })
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        const body = await fetchItem(url)
        return body
      }

      console.error(new Date(), e)
      return {
        body: ''
      }
    }
  }
}
