const {
  Transform
} = require('stream')

// 一定数見つけたら検索をやめます
const MAX = 100
class LimitStream extends Transform {
  constructor(recentItemsStream, fetchPageRankStream) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._recentItemsStream = recentItemsStream
    this._fetchPageRankStream = fetchPageRankStream
    this._count = 0

  }
  _transform(chunk, encoding, callback) {
    this._count++;
    if (this._count > MAX) {
      this.stop()
    }
    callback()
  }
  stop(){
    // https://stackoverflow.com/questions/28621175/node-js-how-to-stop-a-piped-stream-conditionally
    this._recentItemsStream.unpipe(this._fetchPageRankStream)
    this._fetchPageRankStream.end()
  }
}

module.exports = LimitStream
