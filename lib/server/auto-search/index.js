const startSearh = require('../start-search')
const DummyWriter = require('./dummy-writer')
const searchNext = require('./search-next')

module.exports = function(journal) {
  // 最初にタグなしで検索
  const firstCondition = ''

  // 最初の検査具が終わったら、次の検索をする
  const writer = new DummyWriter()
  writer.on('finish', () => searchNext(
    new Set([firstCondition]),
    writer.tags,
    journal
  ))

  // 検索開始
  startSearh(writer, firstCondition, new Set(), journal, 30)
}
