const calculatePageRank = require('../../calculate-page-rank')
const filterByTag = require('./filter-by-tag')
const cutback = require('./cutback')

module.exports = class {
  constructor() {
    this._store = new Map()
  }
  has(key) {
    return this._store.has(key)
  }
  get(key) {
    return this._store.get(key)
  }
  set(url, title, count, content_length, tags, updated_at) {
    this._store.set(url, {
      title,
      url,
      count: Number(count),
      content_length,
      ratio: calculatePageRank(count, content_length),
      tags: tags.map((t) => t.toLowerCase()),
      updated_at
    })
    return this
  }
  getKnowledges(tag) {
    const {
      knownItems,
      knownUrls
    } = filterByTag(this._store, tag)

    return {
      knownItems: cutback(knownItems),
      knownUrls
    }
  }
}
