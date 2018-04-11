const {
  Readable
} = require('stream')
const _ = require('lodash')

// Qitta の ITEM APIのpageの有効範囲は1 〜 100
const pages = _.range(1, 101)

class PageStream extends Readable {
  constructor(tag) {
    super({
      objectMode: true
    })
    this._tag = tag
  }
  _read(size) {
    const page = pages.shift()
    if (page) {
      this.push([page, this._tag])
    } else {
      this.push(null)
    }
  }
}

module.exports = PageStream
