const {
  Transform
} = require('stream')
const recentItems = require('./recent-items')

module.exports = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  async transform([page, tag], encoding, callback) {
    // console.log('page', page)
    const urls = await recentItems(100, page, tag)
    if(urls.length) {
      for (const url of urls) {
        this.push(url)
      }
      // 取得したitemが0件の時は検索をやめます。
      callback()
    }
  }
})
