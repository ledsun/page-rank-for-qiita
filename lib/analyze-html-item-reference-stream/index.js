const {
  Transform
} = require('stream')
const analyzeHtml = require('./analyze-html')

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
      url,
      body,
      user
    } = chunk

    // すでに必要な情報を持っているので分析不要
    if (count && articleLength) {
      this.push(chunk)
    } else {
      this.push(Object.assign(chunk, analyzeHtml(body, user)))
    }

    callback()
  }
}
