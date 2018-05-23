const {
  Transform
} = require('stream')
const fetchOrReadItem = require('./fetch-or-read-item')

module.exports = class extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
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
        body: await fetchOrReadItem(url)
      }))
    }

    callback()
  }
}
