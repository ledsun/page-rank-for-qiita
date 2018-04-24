const PageStream = require('../page-stream')
const RecentItemsStream = require('../recent-items-stream')
const FetchPageRankStream = require('../fetch-page-rank-stream')
const HasPageRankStream = require('../has-page-rank-stream')
const LimitStream = require('../limit-stream')
const WebSocketStream = require('./web-socket-stream')
const QueryHistoryStream = require('./query-history-stream')

// 指定タグで検索して、WebSocketコネクションに送信
module.exports = function search(tag, connection) {
  const pageStream = new PageStream(tag)
  const recentItemsStream = new RecentItemsStream(pageStream)
  const fetchPageRankStream = new FetchPageRankStream()
  const limitStream = new LimitStream(recentItemsStream, fetchPageRankStream)
  const itemStream = pageStream
    .pipe(recentItemsStream)
    .pipe(fetchPageRankStream)

  itemStream.pipe(new WebSocketStream(connection, 'item', tag))
  itemStream.pipe(new QueryHistoryStream(tag))

  // 被参照数1以上の記事が一定数集まったら、検索を止める
  itemStream.pipe(new HasPageRankStream())
    .pipe(limitStream)
  return () => limitStream.stop()
}
