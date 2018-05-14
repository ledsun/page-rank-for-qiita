const PageStream = require('../page-stream')
const RecentItemsStream = require('../recent-items-stream')
const FetchPageRankStream = require('../fetch-page-rank-stream')
const HasPageRankStream = require('../has-page-rank-stream')
const LimitStream = require('../limit-stream')
const CalculatePageRankStream = require('../calculate-page-rank-stream')
const WebSocketWriter = require('./web-socket-writer')
const JournalStream = require('./journal-stream')

// 指定タグで検索して、WebSocketコネクションに送信
module.exports = function(ws, tag, knownUrls, journal, max) {
  const pageStream = new PageStream(tag)
  const recentItemsStream = new RecentItemsStream(pageStream, knownUrls)
  const fetchPageRankStream = new FetchPageRankStream(journal.itemMap)
  const limitStream = new LimitStream(recentItemsStream, fetchPageRankStream, max)

  const itemStream = pageStream
    .pipe(recentItemsStream)
    .pipe(fetchPageRankStream)
    .pipe(new CalculatePageRankStream())

  // クライアントに結果送信
  const websocketWriter = new WebSocketWriter(ws)
  websocketWriter.on('finish', () => console.log(new Date(), 'final', tag))
  itemStream
    .pipe(websocketWriter)

  // 検索履歴保存
  itemStream.pipe(new JournalStream(journal.write))

  // 被参照数1以上の記事が一定数集まったら、検索を止める
  itemStream
    .pipe(new HasPageRankStream())
    .pipe(limitStream)

  return () => limitStream.stop()
}
