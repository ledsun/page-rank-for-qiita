const {
  Writable
} = require('stream')
const fs = require('fs')
const path = require('path')
const ensureDirectoryExistence = require('./ensure-directory-existence')

module.exports = class extends Writable {
  constructor() {
    super({
      objectMode: true,
    })
  }

  _write({
    url,
    body
  }, encode, callback) {
    const file = path.join(`${process.cwd()}/data/public/cache`, `${url.replace('https://qiita.com', '')}.html`)
    ensureDirectoryExistence(file)

    // 既にある時は保存しない
    fs.writeFile(file, body, {
      flag: 'wx'
    }, (err) => {
      if (err) {
        if (err.code !== 'EEXIST') {
          console.error(new Date(), err)
        }
      }
    })
    callback()
  }
}
