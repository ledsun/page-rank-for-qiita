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
    let [count, content_length] = this._itemMap.has(url) ? [this._itemMap.get(url)
        .count, this._itemMap.get(url)
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
