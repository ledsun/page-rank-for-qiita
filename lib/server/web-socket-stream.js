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

  _write(chunk, encode, callback) {
    this._connection.sendUTF(
      JSON.stringify({
        item: chunk
      })
    )
    callback()
  }

  _final() {
    this._connection.close()
    console.log('final');
  }
}
