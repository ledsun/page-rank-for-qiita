const fs = require('fs')
const {
  Transform
} = require('stream')
const isHtml = require('./is-html')

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
      if (err) {
        console.error(new Date(), err)
      } else if (!isHtml(body)) {
        console.error(new Date(), 'body is not html', fullPath, body);
      } else {
        this.push({
          url,
          user,
          body
        })
      }

      callback()
    })
  }
}
