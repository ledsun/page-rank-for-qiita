// クライアントになるhtmlファイル
module.exports = `
<html>
<body>
  Let's search!
  <ol class="list"></ol>
</body>
<script>
const socket = new WebSocket(\`ws://\${location.hostname}:\${location.port}\`)

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
