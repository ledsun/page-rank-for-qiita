const os = require('os')
const {
  Transform
} = require('stream')
const JSONStore = require('json-store')
const db = JSONStore(`${os.tmpdir()}/page-rank-for-qiita__recent-items.json`)

const recentItems = require('./recent-items')

module.exports = class extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })
  }
  async _transform([page, tag], encoding, callback) {
    console.log('page', page)

    let urls = db.get(`${tag}${page}`)
    if (urls === undefined) {
      urls = await recentItems(100, page, tag)
      db.set(`${tag}${page}`, urls)
    }

    if (urls.length) {
      for (const url of urls) {
        this.push(url)
      }
      // 取得したitemが0件の時は検索をやめます。
      callback()
    }
  }
}
