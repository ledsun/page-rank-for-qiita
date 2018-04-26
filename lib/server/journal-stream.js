const fs = require('fs')
const os = require('os')
const {
  Writable
} = require('stream')

const stream = fs.createWriteStream(`${os.tmpdir()}/page-rank-for-qiita__page-rank.tsv`, {
  flags: 'a'
})

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
