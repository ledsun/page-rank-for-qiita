const {
  Writable
} = require('stream')
const queryHistory = require('./query-history')

// 結果の見つかったタグを保存
module.exports = class extends Writable {
  constructor(tag) {
    super({
      objectMode: true,
    })

    this._found = false
    this._tag = tag
  }

  _write(chunk, encode, callback) {
    if(!this._found){
      queryHistory.push(this._tag)
      this._found = true
    }
    callback()
  }
}
