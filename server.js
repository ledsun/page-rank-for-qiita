const http = require('http')
const WebSocketServer = require('websocket')
  .server

const hostname = '127.0.0.1'
const port = 3000

const html = `
<html>
<body>
  Let's search!
  <ol class="list"></ol>
</body>
<script>
const socket = new WebSocket('ws://${hostname}:${port}')

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send(location.pathname)
})

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    const data = JSON.parse(event.data)
    if (data.item) {
      document.querySelector('.list').innerHTML += \`
        <li>
          <a href="\${data.item.url}" target="_blank">\${data.item.title}</a>
        </li>
      \`
    }
})
</script>
</html>
`

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(html)
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

// create the server
const wsServer = new WebSocketServer({
  httpServer: server
})

// WebSocket server
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin)
  let stream

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      const TAG = message.utf8Data.replace('/', '')
      connection.sendUTF(
        JSON.stringify({
          tag: TAG
        })
      )
      stream = search(TAG, connection)
    }
  })

  connection.on('close', (connection) => {
    stream.stop()
  })
})

function search(tag, connection) {
  const PageStream = require('./lib/page-stream')
  const RecentItemsStream = require('./lib/recent-items-stream')
  const FetchPageRankStream = require('./lib/fetch-page-rank-stream')
  const HasPageRankStream = require('./lib/has-page-rank-stream')
  const LimitStream = require('./lib/limit-stream')

  const pageStream = new PageStream(tag)
  const recentItemsStream = new RecentItemsStream()
  const fetchPageRankStream = new FetchPageRankStream()
  const limitStream = new LimitStream(recentItemsStream, fetchPageRankStream)

  const pageRankStream = pageStream
    .pipe(recentItemsStream)
    .pipe(fetchPageRankStream)
    .pipe(new HasPageRankStream())

  pageRankStream.pipe(limitStream)

  const {
    Writable
  } = require('stream')
  const wsStream = new Writable({
    objectMode: true,
    write(chunk, encode, callback) {
      connection.sendUTF(
        JSON.stringify({
          item: chunk
        })
      )
      callback()
    },
    final() {
      connection.close()
      console.log('final');
    }
  })
  pageRankStream.pipe(wsStream)

  return limitStream
}
