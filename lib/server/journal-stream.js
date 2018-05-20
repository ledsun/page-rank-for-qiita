const fs = require('fs')
const {
  Writable
} = require('stream')

module.exports = class extends Writable {
  constructor(writeJorunal) {
    super({
      objectMode: true,
    })
    this._writeJorunal = writeJorunal
  }

  _write(chunk, encode, callback) {
    this._writeJorunal(chunk)
    callback()
  }
}
