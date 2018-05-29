const startSearh = require('../start-search')
const DummyWriter = require('./dummy-writer')

module.exports = searchNext

function searchNext(already, tags, journal) {
  // 一定数以上見つかったら停止
  if (already.size > 300) {
    console.log(new Date(), 'Finish auto search.')
    return
  }

  // すでに検索済みのタグはスキップ
  const next = Array.from(tags.values())
    .filter((t) => !already.has(t))

  if (!next.length) {
    console.log(new Date(), 'Finish auto search. There is no more tag.')
    return
  }

  const writer = new DummyWriter()
  writer.on('finish', () => searchNext(
    already.add(next[0]),
    new Set([...tags, ...writer.tags]),
    journal
  ))

  startSearh(writer, next[0], new Set(), journal, 30)
}
