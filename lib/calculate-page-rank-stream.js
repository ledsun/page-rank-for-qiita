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
    const {
      count,
      articleLength,
      updated_at
    } = chunk
    this.push(Object.assign(chunk, {
      ratio: calculatePageRank(count, articleLength, updated_at)
    }))
    callback()
  }
}
