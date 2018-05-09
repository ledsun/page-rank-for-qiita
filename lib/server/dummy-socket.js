let tags = new Set()
let callback

module.exports = {
  on() {},
  sendUTF(json) {
    const data = JSON.parse(json)
    if (data.item !== '-') {
      for (const tag of data.item.tags) {
        tags.add(tag)
      }
    }
  },
  close() {
    callback(Array.from(tags.values()))
  },
  done(fn) {
    callback = fn
  }
}
