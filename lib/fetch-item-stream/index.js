const {
  Transform
} = require('stream')
const getItem = require('./get-item')

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

    this.push(Object.assign(chunk, await getItem(this._ignoreItems, url)))

    callback()
  }
}
