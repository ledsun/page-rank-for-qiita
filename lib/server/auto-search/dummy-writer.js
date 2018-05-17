const {
  Writable
} = require('stream')

// 結果をWebsocketコネクションで送信
module.exports = class extends Writable {
  constructor() {
    super({
      objectMode: true,
    })
    this._tags = new Set()
  }

  _write(item, encode, callback) {
    if (item.ratio) {
      for (const tag of item.tags) {
        this._tags.add(tag)
      }
    }
    callback()
  }

  get tags() {
    return this._tags
  }
}
