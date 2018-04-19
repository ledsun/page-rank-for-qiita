const http = require('http')
const WebSocketServer = require('websocket')
  .server
const html = require('./lib/server/html')
const startSearh = require('./lib/server/start-search')

const HOSTNAME = '127.0.0.1'
const PORT = 3000
const httpServer = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(html)
})
const wsServer = new WebSocketServer({
  httpServer
})

httpServer.listen(PORT, HOSTNAME, () => console.log(`Server running at http://${HOSTNAME}:${PORT}/`))
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin)
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      startSearh(message.utf8Data, connection)
    }
  })
})
