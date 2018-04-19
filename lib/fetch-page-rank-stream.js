const os = require('os')
const {
  Transform
} = require('stream')
const JSONStore = require('json-store')
const db = JSONStore(`${os.tmpdir()}/page-rank-for-qiita__page-rank.json`)
const fetchPageRank = require('./fetch-page-rank')

module.exports = class extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
  }

  async _transform({
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
}
