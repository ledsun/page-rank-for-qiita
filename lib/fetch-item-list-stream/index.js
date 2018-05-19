const {
  Transform
} = require('stream')
const fetchOrReadFetchItemList = require('./fetch-or-read-fetch-item-list')

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

    try {
      const items = await fetchOrReadFetchItemList(tag, page)
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
    } catch (e) {
      console.error(new Date(), e)
    } finally {
      this._pageStream.resume()
      callback()
    }
  }

  _stop(page, tag) {
    console.log(new Date(), 'stop recent items', `${tag}${page}`)
    this._pageStream.unpipe(this)
    this.end()
  }
}
