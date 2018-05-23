const {
  Transform
} = require('stream')

// 検索を始める前にitemMapの情報をマージする
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
      url
    } = chunk

    this.push(Object.assign(chunk, this._itemMap.get(url)))

    callback()
  }
}
