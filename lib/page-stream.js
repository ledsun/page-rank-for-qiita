const {
  Readable
} = require('stream')
const _ = require('lodash')

class PageStream extends Readable {
  constructor(tag) {
    super({
      objectMode: true
    })
    this._tag = tag
    // Qitta の ITEM APIのpageの有効範囲は1 〜 100
    this._pages = _.range(1, 101)
  }
  _read(size) {
    const page = this._pages.shift()
    if (page) {
      this.push([page, this._tag])
    } else {
      this.push(null)
    }
  }
}

module.exports = PageStream
