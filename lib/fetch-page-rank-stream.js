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

  async _transform(chunk, encoding, callback) {
    const {
      url,
      user
    } = chunk

    // 毎回スクレイピングしていると遅い。キャッシュを参照する
    let count = this._pageRank.has(url) ?
      this._pageRank.get(url)
      .count :
      await fetchPageRank(url, user)

    this.push(Object.assign({}, chunk, {
      count
    }))
    callback()
  }
}
