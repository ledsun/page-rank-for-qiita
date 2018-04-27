const socket = new WebSocket(`ws://${location.hostname}:${location.port}`)

let numberOfItems = 0
let scrolled = false

// Connection opened
socket.addEventListener('open', (event) => {
  const tagName = getTagName()
  numberOfItems = 0

  // nullを送るを文字列'null'を送ってしまう
  socket.send(tagName ? tagName : '')
})

// Listen for messages
socket.addEventListener('message', (event) => {
  // console.log('Message from server ', event.data)
  const data = JSON.parse(event.data)

  if (data.tag !== undefined) {
    document.querySelector('.results')
      .innerText += ` ${data.tag ? data.tag : 'all'}`
  }

  if (data.item) {
    if (!scrolled) {
      scrollToSearch()
      scrolled = true
    }

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

  if (!scrolled) {
    scrollToSearch()
    scrolled = true
  }
})

function getTagName() {
  const params = (new URL(document.location))
    .searchParams
  return params.get('tag')
}

function scrollToSearch() {
  // クエリ文字列がない時はスクロールしない
  if (getTagName()) {
    window.scroll(0, document.querySelector('form')
      .getBoundingClientRect()
      .top - document.body.getBoundingClientRect()
      .top)
  }
}

const source = `
<li>
<div class="col-12">
  <a href="{{url}}" target="_blank">{{title}}</a>
  <ul class="results__tag-list">
  {{#each tags}}
    <li><a href="/?tag={{this}}" class="badge badge-secondary mr-1">{{this}}</a></li>
  {{/each}}
  </ul>
</div>
</li>
`
const template = Handlebars.compile(source)

function showItem(item) {
  document.querySelector('.list')
    .innerHTML += template(item)
}
