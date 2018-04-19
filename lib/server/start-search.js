const search = require('./search')

module.exports = function(message, connection) {
  const tag = message.replace('/', '')
  connection.sendUTF(
    JSON.stringify({
      tag: tag
    })
  )

  const stopSearch = search(tag, connection)

  // WebSocketがクライアント側から閉じられたときに検索を中止
  connection.on('close', (connection) => stopSearch())
}
