const _ = require('lodash')
const recentItemsStream = require('./lib/recent-items-stream')
const fetchPageRankStream = require('./lib/fetch-page-rank-stream')
const templateStream = require('./lib/template-stream')
const hasPageRankStream = require('./lib/has-page-rank-stream')

const TAG = process.argv[2]

recentItemsStream
  .pipe(fetchPageRankStream)
  .pipe(hasPageRankStream)
  .pipe(templateStream)
  .pipe(process.stdout)

;
(async () => {
  console.log('Please wait ...')
  // ITEM APIに指定するページの範囲
  // 1リクエストあたり100件でページ分割されています。
  for (page of _.range(1, 5)) {
    recentItemsStream.write([page, TAG])
  }
})()
