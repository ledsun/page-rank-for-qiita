const {
  Transform
} = require('stream')

// 検索を始める前にignoreItemsに記載のURLを捨てる
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
      url
    } = chunk

    if (!this._ignoreItems.has(url)) {
      this.push(chunk)
    }

    callback()
  }
}
