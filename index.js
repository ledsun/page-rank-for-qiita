const _ = require('lodash')
const recentItemsStream = require('./lib/recent-items-stream')
const fetchPageRankStream = require('./lib/fetch-page-rank-stream')
const templateStream = require('./lib/template-stream')
const hasPageRankStream = require('./lib/has-page-rank-stream')
const {
  Readable,
  Transform
} = require('stream')

const TAG = process.argv[2]

const pages = _.range(1, 101)
const pageStream = new Readable({
  objectMode: true,
  read(size) {
    const page = pages.shift()
    if (page) {
      this.push([page, TAG])
    } else {
      this.push(null)
    }
  }
})

// 一定数見つけたら検索をやめます
let count = 0
const limitStream = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    count++;
    if (count > 35) {
      // https://stackoverflow.com/questions/28621175/node-js-how-to-stop-a-piped-stream-conditionally
      recentItemsStream.unpipe(fetchPageRankStream)
      fetchPageRankStream.end()
    }
    callback()
  }
})

const hoge = pageStream
  .pipe(recentItemsStream)
  .pipe(fetchPageRankStream)
  .pipe(hasPageRankStream)
  .pipe(templateStream)

hoge.pipe(limitStream)
hoge.pipe(process.stdout)
