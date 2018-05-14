const {
  Writable
} = require('stream')

// 結果をWebsocketコネクションで送信
module.exports = class extends Writable {
  constructor(connection, tag) {
    super({
      objectMode: true,
    })

    this._connection = connection
    this._tag = tag
  }

  _write({
    url,
    title,
    count,
    ratio,
    tags,
    updated_at
  }, encode, callback) {
    const data = {}
    // 通信料を削減するため、conutがない時はデータを省略
    // 表示に必要なプロパティだけ送る
    data.item = count ? {
      title,
      url,
      tags,
      ratio,
      updated_at
    } : '-'

    this._connection.sendUTF(
      JSON.stringify(data)
    )
    callback()
  }

  _final() {
    this._connection.close()
    console.log(new Date(), 'final', this._tag)
  }
}
