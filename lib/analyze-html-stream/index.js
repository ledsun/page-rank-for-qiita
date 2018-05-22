const {
  Transform
} = require('stream')
const fs = require('fs')
const path = require('path')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const analyzeHtml = require('./analyze-html')

module.exports = class extends Transform {
  constructor(itemMap) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._itemMap = itemMap
  }

  _transform(chunk, encoding, callback) {
    const {
      url,
      body,
      user
    } = chunk

    // 毎回パースしていると遅い。キャッシュを参照する
    if (this._itemMap.has(url)) {
      this.push(Object.assign(chunk, this._itemMap.get(url)))
    } else {
      const [count, articleLength] = analyzeHtml(body, user)
      if (count) {
        const file = path.join(`${process.cwd()}/data/public/cache`, `${url.replace('https://qiita.com', '')}.html`)
        ensureDirectoryExistence(file)
        fs.writeFile(file, body, (err) => {
          if (err) console.error(new Date(), err)
        })
      }

      this.push(Object.assign(chunk, {
        count,
        articleLength
      }))
    }

    callback()
  }
}
