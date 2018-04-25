const os = require('os')
const {
  Transform
} = require('stream')
const JSONStore = require('json-store')
const db = JSONStore(`${os.tmpdir()}/page-rank-for-qiita__recent-items.json`)

const recentItems = require('./recent-items')

module.exports = class extends Transform {
  constructor(pageStream) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this._pageStream = pageStream
    this._live = true
  }
  async _transform([page, tag], encoding, callback) {
    // 記事がもう見つからない時は、記事検索中にバッファに積まれたページを無視します。
    if (this._live) {
      const key = `${tag}${page}`
      console.log('start recent items', key)

      //記事を検索
      let urls = db.get(key)
      if (urls === undefined) {
        urls = await recentItems(100, page, tag)
        db.set(key, urls)
      }

      if (urls) {
        // 発見した記事を１つずつプッシュ
        if (urls.length) {
          for (const url of urls) {
            this.push(url)
          }
        } else {
          // 取得したitemが0件の時は検索をやめます。
          this._stop(page, tag)
        }
      } else {
        // おそらくリトライを諦めたときにここに来る
        console.error('urls is', urls, key);
      }
    }

    callback()
  }
  _stop(page, tag) {
    console.log('stop recent items', `${tag}${page}`)
    this._pageStream.unpipe(this)
    this._live = false
    this.end()
  }
}
