const os = require('os')
const {
  Transform
} = require('stream')
const fetchPageRank = require('./fetch-page-rank')

module.exports = class extends Transform {
  constructor(itemMap) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._itemMap = itemMap
  }

  async _transform(chunk, encoding, callback) {
    const {
      url,
      user
    } = chunk

    // 毎回スクレイピングしていると遅い。キャッシュを参照する
    let [count, articleLength] = this._itemMap.has(url) ? [this._itemMap.get(url)
        .count, this._itemMap.get(url)
        .articleLength
      ] :
      await fetchPageRank(url, user)

    this.push(Object.assign({}, chunk, {
      count,
      articleLength
    }))
    callback()
  }
}
