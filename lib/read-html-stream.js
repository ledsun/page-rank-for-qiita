const fs = require('fs')
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
    const {
      path,
      fullPath
    } = chunk
    const url = `https://qiita.com/${path}`.replace('.html', '')
    const user = path.split('/')[0]
    const body = fs.readFile(fullPath, {
      encoding: 'utf8'
    }, (err, body) => {
      this.push({
        url,
        user,
        body
      })
      callback()
    })
  }
}
