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
  // ITEM APIに指定するページの範囲
  // 1リクエストあたり100件の制限があるので、ページ数を変えて繰り返し実行します。
  for (page of _.range(1, 5)) {
    recentItemsStream.write([page, TAG])
  }
})()
