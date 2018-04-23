const {
  Writable
} = require('stream')

// 結果をWebsocketコネクションで送信
module.exports = class extends Writable {
  constructor(connection, key) {
    super({
      objectMode: true,
    })

    this._connection = connection
    this._key = key
  }

  _write(chunk, encode, callback) {
    const data = {}
    data[this._key] = chunk
    this._connection.sendUTF(
      JSON.stringify(data)
    )
    callback()
  }

  _final() {
    this._connection.close()
    console.log('final');
  }
}
