const search = require('./search')

module.exports = function(tag, connection) {
  connection.sendUTF(
    JSON.stringify({
      tag
    })
  )

  const stopSearch = search(tag, connection)

  // WebSocketがクライアント側から閉じられたときに検索を中止
  connection.on('close', (connection) => stopSearch())
}
