const {
  Writable
} = require('stream')

// 結果をWebsocketコネクションで送信
module.exports = class extends Writable {
  constructor(connection) {
    super({
      objectMode: true,
    })

    this._connection = connection
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
    data.item = ratio ? {
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

  _final(callback) {
    this._connection.close()
    callback()
  }
}
