const PageStream = require('../page-stream')
const RecentItemsStream = require('../recent-items-stream')
const FetchPageRankStream = require('../fetch-page-rank-stream')
const HasPageRankStream = require('../has-page-rank-stream')
const LimitStream = require('../limit-stream')
const WebSocketStream = require('./web-socket-stream')

// 指定タグで検索して、WebSocketコネクションに送信
module.exports = function search(tag, connection) {
  const pageStream = new PageStream(tag)
  const recentItemsStream = new RecentItemsStream()
  const fetchPageRankStream = new FetchPageRankStream()
  const limitStream = new LimitStream(recentItemsStream, fetchPageRankStream)

  const page1Stream = pageStream
    .pipe(recentItemsStream)
    .pipe(fetchPageRankStream)

  page1Stream.pipe(new WebSocketStream(connection, 'hoge'))

  const pageRankStream = page1Stream.pipe(new HasPageRankStream())

  pageRankStream.pipe(limitStream)
  pageRankStream.pipe(new WebSocketStream(connection, 'item'))

  return () => limitStream.stop()
}
