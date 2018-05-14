const startSearh = require('./start-search')
const WebSocketWriter = require('./web-socket-writer')

module.exports = function(sessionStore, journal) {
  return function(request) {
    const connection = request.accept(null, request.origin)
    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        const sessionId = message.utf8Data
        if (sessionStore.has(sessionId)) {
          const {
            tag,
            knownUrls
          } = sessionStore.get(sessionId)

          // クライアントに結果送信
          const websocketWriter = new WebSocketWriter(connection)

          const stop = startSearh(websocketWriter, tag, knownUrls, journal, 300)

          // WebSocketがクライアント側から閉じられたときに検索を中止
          connection.on('close', stop)
        } else {
          connection.close()
        }
      }
    })
  }
}
