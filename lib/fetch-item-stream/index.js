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
      url
    } = chunk

    this.push(Object.assign(chunk, await fetchOrReadItem(this._ignoreItems, url)))

    callback()
  }
}
