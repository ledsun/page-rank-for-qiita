const readline = require('readline')
const ReadHtmlStream = require('./read-html-stream')
const ParseHtmlStream = require('./parse-html-stream')
const AnalyzeHtmlItemMetaInfoStream = require('./analyze-html-item-meta-info-stream')
const AnalyzeHtmlStream = require('./analyze-html-stream')
const CalculatePageRankStream = require('./calculate-page-rank-stream')
const journal = require('./journal')
const JournalStream = require('./journal-stream')

const stream = new ReadHtmlStream()
stream
  .pipe(new ParseHtmlStream())
  .pipe(new AnalyzeHtmlItemMetaInfoStream())
  .pipe(new AnalyzeHtmlStream())
  .pipe(new CalculatePageRankStream())
  .pipe(new JournalStream(journal.write))

// 親プロセスからのメッセージを受けたら
// ストリームに書き込む
const listener = (message) => {
  if (message === 'finish') {
    // 終了メッセージが来たら、イベントハンドラーを消す
    process.off('message', listener)
  } else {
    stream.write(message)
  }
}
process.on('message', listener)
