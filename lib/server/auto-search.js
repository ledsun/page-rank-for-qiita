const startSearh = require('./start-search')
const dummySocket = require('./dummy-socket')
const WebSocketWriter = require('./web-socket-writer')

module.exports = function(journal) {
  const already = new Set()

  // 前回の検索でみつかたタグを対象にする
  dummySocket.done((tags) => {
    // 一定数以上見つかったら停止
    if (already.size > 300) {
      console.log(new Date(), 'Finish auto search.')
      return
    }

    // すでに検索済みのタグはスキップ
    const next = tags.filter((t) => !already.has(t))
    if (next.length) {
      already.add(next[0])
      const websocketWriter = new WebSocketWriter(dummySocket)
      setTimeout(() => startSearh(websocketWriter, next[0], new Set(), journal, 30), 100)
    } else {
      console.log(new Date(), 'Finish auto search. There is no more tag.')
    }
  })

  // 最初にタグなしで検索
  already.add('')
  const websocketWriter = new WebSocketWriter(dummySocket)
  startSearh(websocketWriter, '', new Set(), journal)
}
