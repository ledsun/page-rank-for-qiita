const startSearh = require('./start-search')

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
          const stop = startSearh(connection, tag, knownUrls, journal, 300)

          // WebSocketがクライアント側から閉じられたときに検索を中止
          connection.on('close', stop)
        } else {
          connection.close()
        }
      }
    })
  }
}
