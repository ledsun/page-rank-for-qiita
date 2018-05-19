const os = require('os')
const {
  Transform
} = require('stream')
const getItemAttributes = require('./get-item-attributes')

module.exports = class extends Transform {
  constructor({
    itemMap,
    ignoreItems
  }) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._itemMap = itemMap
    this._ignoreItems = ignoreItems
  }

  async _transform(chunk, encoding, callback) {
    const {
      url,
      user
    } = chunk

    this.push(Object.assign(chunk, await getItemAttributes(this._ignoreItems, this._itemMap, url, user)))

    callback()
  }
}
