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
    let [count, content_length] = this._pageRank.has(url) ? [this._pageRank.get(url)
        .count, this._pageRank.get(url)
        .content_length
      ] :
      await fetchPageRank(url, user)

    this.push(Object.assign({}, chunk, {
      count,
      content_length
    }))
    callback()
  }
}
