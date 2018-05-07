(function() {
  function startSearch() {
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
      // console.log(new Date(), 'Message from server ', event.data)
      const data = JSON.parse(event.data)

      if (data.tag !== undefined) {
        document.querySelector('.search-condition')
          .innerText = `${data.tag ? data.tag : 'すべて'}`
      }

      if (data.item) {
        if (!scrolled) {
          scrollToSearchResult()
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
        .innerText = '完了'

      if (!scrolled) {
        scrollToSearchResult()
        scrolled = true
      }
    })
  }

  function getTagName() {
    const params = (new URL(document.location))
      .searchParams
    return params.get('tag')
  }

  function scrollToSearchResult() {
    // クエリ文字列がない時はスクロールしない
    if (getTagName()) {
      window.scroll(0, document.querySelector('.items')
        .getBoundingClientRect()
        .top - document.body.getBoundingClientRect()
        .top)
    }
  }

  const app = new Vue({
    el: '#app',
    data: {
      results: new Map(),
      resultsChaged: 1
    },
    computed: {
      resultList() {
        // https://stackoverflow.com/questions/37130105/does-vue-support-reactivity-on-map-and-set-data-typess
        if (this.resultsChaged) {
          const items = Array.from(this.results.values())
          return items.sort((a, b) => {
              // カウント、更新日降順
              return (a.ratio < b.ratio) ? 1 :
                (a.ratio > b.ratio) ? -1 :
                (a.updated_at < b.updated_at) ? 1 :
                (a.updated_at > b.updated_at) ? -1 :
                0
            })
            .slice(0, 500) // 5000件見つかることがある。描画速度が維持できない
        }
      }
    },
    watch: {
      results(val) {
        alert("yes, computed property changed")
      }
    },
    methods: {
      addResults(item) {
        // Decode html string
        // https://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
        const dom = new DOMParser()
          .parseFromString(
            `<!doctype html><body>${item.title}`,
            'text/html')
        item.title = dom.body.textContent

        // Encode tags for link
        item.tags = item.tags.map((t) => ({
          text: t,
          encoded: encodeURIComponent(t)
        }))

        // calculate page rank
        item.ratio = (item.count / item.content_length * 100000)
          .toFixed(2)

        this.results.set(item.url, item)
        this.resultsChaged += 1
      }
    }
  })

  function showItem(item) {
    app.addResults(item)
  }

  function enablePreview() {
    class Preview {
      constructor(body) {
        this._main = body.querySelector('.main')
        this._preview = body.querySelector('.preview')
      }
      show() {
        if (!this._preview.classList.contains('preview--show')) {
          // mainに高さがないのでbodyの位置を使います。
          const scroll = document.body.getBoundingClientRect()
            .top

          this._main.classList.add('main-half')
          this._preview.classList.add('preview--show')

          this._main.scrollTop = -scroll
        }
      }
      hide() {
        if (this._preview.classList.contains('preview--show')) {
          // mainの中の最初の要素の位置を使います。
          const scroll = document.querySelector('.main')
            .children[0].getBoundingClientRect()
            .top

          this._preview.classList.remove('preview--show')
          this._main.classList.remove('main-half')

          document.body.scrollTop = -scroll
        }
      }
      setUrl(url) {
        if (this._preview.dataset.url !== url) {
          this._preview.dataset.url = url
          const cacheUrl = `cache${url.replace('https://qiita.com', '')}.html`
          const iframe = this._preview.querySelector('iframe')
          if (iframe.getAttribute('src') !== cacheUrl) {
            iframe.setAttribute('src', cacheUrl)
          }
        }
      }
      get url() {
        return this._preview.dataset.url
      }
    }

    const preview = new Preview(document.body)

    document.addEventListener('click', (e) => {
      const {
        target
      } = e

      // 記事リンクをクリックしたらプレビューを表示
      if (target.closest('.results__item-link')) {
        e.preventDefault()

        preview.show()
        preview.setUrl(target.href)
      }

      // Qiitaで開くバーをクリック
      if (target.closest('.preview__open-in-qiita')) {
        e.preventDefault()
        e.stopPropagation()
        window.open(preview.url, '_blank')
      }

      // プレビューを閉じる
      if (target.closest('.preview__close')) {
        e.preventDefault()
        e.stopPropagation()
        preview.hide()
      }
    })
  }

  // キャッシュの情報を表示する
  function initView() {
    if (window.pageRanks) {
      const tagName = getTagName()
      for (const pageRank of pageRanks()) {
        if (tagName) {
          if (pageRank.tags.includes(tagName)) {
            app.addResults(pageRank)
          }
        } else {
          app.addResults(pageRank)
        }
      }
    }
  }

  startSearch()
  enablePreview()
  initView()
})()
