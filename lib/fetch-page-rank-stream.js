const os = require('os')
const {
  Transform
} = require('stream')
const fetchPageRank = require('./fetch-page-rank')

module.exports = class extends Transform {
  constructor(pageRank) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._pageRank = pageRank
  }

  async _transform({
    tag,
    title,
    url,
    user
  }, encoding, callback) {
    // 毎回スクレイピングしていると遅い。キャッシュを参照する
    let count = this._pageRank.has(url) ?
      this._pageRank.get(url) :
      await fetchPageRank(url, user)

    this.push({
      tag,
      title,
      url,
      count
    })
    callback()
  }
}
