const socket = new WebSocket(`ws://${location.hostname}:${location.port}`)

let numberOfItems = 0

// Connection opened
socket.addEventListener('open', (event) => {
  const params = (new URL(document.location))
    .searchParams
  const tagName = params.get('tag')
  numberOfItems = 0

  // nullを送るを文字列'null'を送ってしまう
  socket.send(tagName ? tagName : '')
})

// Listen for messages
socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
  const data = JSON.parse(event.data)

  if (data.tag !== undefined) {
    document.querySelector('.results')
      .innerText += ` ${data.tag ? data.tag : 'all'}`
  }

  if (data.item) {
    numberOfItems++;
    document.querySelector('.items')
      .innerText = numberOfItems

    if (data.item.count > 0) {
      showItem(data.item)
    }
  }
})

// Connection closed
socket.addEventListener('close', (event) => {
  document.querySelector('.status')
    .innerText = 'Bye Bye, see you!'
})

function showItem(item) {
  document.querySelector('.list')
    .innerHTML += `
  <li>
    <div class="col-12">
      <a href="${item.url}" target="_blank">${item.title}</a>
    </div>
  </li>
  `
}
