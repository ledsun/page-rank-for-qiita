const PageStream = require('../page-stream')
const RecentItemsStream = require('../recent-items-stream')
const FetchItemAttributesStream = require('../fetch-item-attributes-stream')
const HasPageRankStream = require('../has-page-rank-stream')
const LimitStream = require('../limit-stream')
const CalculatePageRankStream = require('../calculate-page-rank-stream')
const logMemoryUsage = require('./log-memory-usage')
const JournalStream = require('./journal-stream')

// 指定タグで検索して、WebSocketコネクションに送信
module.exports = function(resultSender, tag, knownUrls, journal, max) {
  logMemoryUsage('start-search', tag)

  const pageStream = new PageStream(tag)
  const recentItemsStream = new RecentItemsStream(pageStream, knownUrls)
  const fetchItemAttributesStream = new FetchItemAttributesStream(journal)
  const limitStream = new LimitStream(recentItemsStream, fetchItemAttributesStream, max)

  const itemStream = pageStream
    .pipe(recentItemsStream)
    .pipe(fetchItemAttributesStream)
    .pipe(new CalculatePageRankStream())

  // 結果を送る
  resultSender.on('finish', () => logMemoryUsage('finish-search', tag))
  itemStream.pipe(resultSender)

  // 検索履歴保存
  itemStream.pipe(new JournalStream(journal.write))

  // 被参照数1以上の記事が一定数集まったら、検索を止める
  itemStream
    .pipe(new HasPageRankStream())
    .pipe(limitStream)

  return () => limitStream.stop()
}
