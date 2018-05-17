const os = require('os')
const {
  Transform
} = require('stream')
const JSONStore = require('json-store')
const db = JSONStore(`${os.tmpdir()}/page-rank-for-qiita__recent-items.json`)

const recentItems = require('./recent-items')

module.exports = class extends Transform {
  constructor(pageStream, knownUrls) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this._pageStream = pageStream
    this._knownUrls = knownUrls
  }
  async _transform([page, tag], encoding, callback) {
    // ページに対して100倍の記事に増える。
    // 検索中止時に、バッファに積んである次のページに進まないように、100個書き終わってから次を読みます。
    this._pageStream.pause()

    const key = `${tag}${page}`
    console.log(new Date(), 'start recent items', key)

    //記事を検索
    let items = db.get(key)
    if (items === undefined) {
      items = await recentItems(100, page, tag)
      db.set(key, items)
    }

    if (items) {
      // 発見した記事を１つずつプッシュ
      if (items.length) {
        for (const item of items) {
          if (this._knownUrls.has(item.url)) {
            continue
          }
          this.push(item)
        }
      } else {
        // 取得したitemが0件の時は検索をやめます。
        this._stop(page, tag)
      }
    } else {
      // おそらくリトライを諦めたときにここに来る
      console.error(new Date(), 'items is', items, key);
    }

    this._pageStream.resume()
    callback()
  }
  _stop(page, tag) {
    console.log(new Date(), 'stop recent items', `${tag}${page}`)
    this._pageStream.unpipe(this)
    this.end()
  }
}
