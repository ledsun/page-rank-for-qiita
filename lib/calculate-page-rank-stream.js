const {
  Transform
} = require('stream')
const calculatePageRank = require('./calculate-page-rank')

module.exports = class extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
  }

  _transform(chunk, encoding, callback) {
    this.push(Object.assign(chunk, {
      ratio: calculatePageRank(chunk.count, chunk.content_length)
    }))
    callback()
  }
}
