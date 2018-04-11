const {
  Transform
} = require('stream')

// 一定数見つけたら検索をやめます
const MAX = 35
let count = 0
class LimitStream extends Transform {
  constructor(recentItemsStream, fetchPageRankStream) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._recentItemsStream = recentItemsStream
    this._fetchPageRankStream = fetchPageRankStream
  }
  _transform(chunk, encoding, callback) {
    count++;
    if (count > MAX) {
      // https://stackoverflow.com/questions/28621175/node-js-how-to-stop-a-piped-stream-conditionally
      this._recentItemsStream.unpipe(this._fetchPageRankStream)
    }
    callback()
  }
}

module.exports = LimitStream
