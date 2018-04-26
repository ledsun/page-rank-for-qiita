const search = require('./search')

module.exports = function(message, wsConnection, journal) {
  const tag = message.toLowerCase()

  // 最初にタグを送り返す
  wsConnection.sendUTF(
    JSON.stringify({
      tag
    })
  )

  const stopSearch = search(tag, wsConnection, journal)

  // WebSocketがクライアント側から閉じられたときに検索を中止
  wsConnection.on('close', (wsConnection) => stopSearch())
}
