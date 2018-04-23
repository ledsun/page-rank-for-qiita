const socket = new WebSocket(`ws://${location.hostname}:${location.port}`)

// Connection opened
socket.addEventListener('open', (event) => {
  const params = (new URL(document.location))
    .searchParams
  const tagName = params.get('tag')
  socket.send(tagName)
})

// Listen for messages
socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
  const data = JSON.parse(event.data)

  if (data.item) {
    if (data.item.count > 0) {
      document.querySelector('.list')
        .innerHTML += `
      <li>
        <div class="col-12">
          <a href="${data.item.url}" target="_blank">${data.item.title}</a>
        </div>
      </li>
      `
    }
  }
})

// Connection closed
socket.addEventListener('close', (event) => {
  document.querySelector('.status')
    .innerText = 'Bye Bye, see you!'
})
