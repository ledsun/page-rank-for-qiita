const PageStream = require('../page-stream')
const FetchItemListStream = require('../fetch-item-list-stream')
const FetchItemStream = require('../fetch-item-stream')
const AnalyzeHtmlStream = require('../analyze-html-stream')
const HasPageRankStream = require('../has-page-rank-stream')
const CacheHtmlStream = require('../cache-html-stream')
const LimitStream = require('../limit-stream')
const CalculatePageRankStream = require('../calculate-page-rank-stream')
const logMemoryUsage = require('./log-memory-usage')
const JournalStream = require('./journal-stream')

// 指定タグで検索して、WebSocketコネクションに送信
module.exports = function(resultSender, tag, knownUrls, journal, max) {
  logMemoryUsage('start-search', tag)

  const pageStream = new PageStream(tag)
  const fetchItemListStream = new FetchItemListStream(pageStream, knownUrls)
  const fetchItemStream = new FetchItemStream(journal.ignoreItems)
  const limitStream = new LimitStream(fetchItemListStream, fetchItemStream, max)

  const itemStream = pageStream
    .pipe(fetchItemListStream)
    .pipe(fetchItemStream)
    .pipe(new AnalyzeHtmlStream(journal.itemMap))
    .pipe(new CalculatePageRankStream())

  // 結果を送る
  resultSender.on('finish', () => logMemoryUsage('finish-search', tag))
  itemStream.pipe(resultSender)

  // 検索履歴保存
  itemStream.pipe(new JournalStream(journal.write))

  const foundItemSteram = itemStream
    .pipe(new HasPageRankStream())

  // 被参照数1以上の記事が一定数集まったら、検索を止める
  foundItemSteram.pipe(limitStream)
  foundItemSteram.pipe(new CacheHtmlStream())

  return () => limitStream.stop()
}
