const {
  Transform
} = require('stream')
const analyzeHtml = require('./analyze-html')

module.exports = class extends Transform {
  constructor(itemMap) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._itemMap = itemMap
  }

  _transform(chunk, encoding, callback) {
    const {
      url,
      body,
      user
    } = chunk

    // 毎回パースしていると遅い。キャッシュを参照する
    if (this._itemMap.has(url)) {
      this.push(Object.assign(chunk, this._itemMap.get(url)))
    } else {
      this.push(Object.assign(chunk, analyzeHtml(body, user)))
    }

    callback()
  }
}
