const {
  Transform
} = require('stream')

module.exports = class extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
  }

  _transform(chunk, encoding, callback) {
    if (chunk.ratio > 0) {
      this.push(chunk)
    }
    callback()
  }
}
