const {
  Transform
} = require('stream')
const recentItems = require('./recent-items')

module.exports = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  async transform([page, tag], encoding, callback) {
    const urls = await recentItems(100, page, tag)
    for (const url of urls) {
      this.push(url)
    }
    callback()
  }
})
