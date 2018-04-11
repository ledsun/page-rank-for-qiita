const {
  Transform
} = require('stream')
const JSONStore = require('json-store')
const db = JSONStore('/tmp/page-rank.json')
const fetchPageRank = require('./fetch-page-rank')

module.exports = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  async transform({
    title,
    url,
    user
  }, encoding, callback) {
    // 毎回スクレイピングしていると遅いので、キャッシュする
    let count = db.get(url)
    if (count === undefined) {
      count = await fetchPageRank(url, user)
      db.set(url, count)
    }

    this.push({
      title,
      url,
      count
    })
    callback()
  }
})
