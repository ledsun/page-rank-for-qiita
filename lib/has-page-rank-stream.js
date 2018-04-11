const _ = require('lodash')
const {
  Transform
} = require('stream');

module.exports = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    if (chunk.count > 0) {
      this.push(chunk)
    }
    callback()
  }
})
