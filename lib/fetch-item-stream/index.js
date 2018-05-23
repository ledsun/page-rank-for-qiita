const {
  Transform
} = require('stream')
const fetchOrReadItem = require('./fetch-or-read-item')

module.exports = class extends Transform {
  constructor(ignoreItems) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._ignoreItems = ignoreItems
  }

  async _transform(chunk, encoding, callback) {
    const {
      count,
      articleLength,
      url
    } = chunk

    // すでに必要な情報を持っているので記事本文の取得不要
    if (count && articleLength) {
      this.push(chunk)
    } else {
      this.push(Object.assign(chunk, {
        body: await fetchOrReadItem(this._ignoreItems, url)
      }))
    }

    callback()
  }
}
