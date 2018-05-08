const calculatePageRank = require('../calculate-page-rank')

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
  set(url, title, count, content_length, tags, created_at, updated_at) {
    this._store.set(url, {
      title,
      url,
      count: Number(count),
      content_length,
      ratio: calculatePageRank(count, content_length),
      tags: tags.map((t) => t.toLowerCase()),
      created_at,
      updated_at
    })
    return this
  }
  getKnowledges(tag) {
    const knownItems = []
    const knownUrls = new Set()
    for (const [url, pageRank] of this._store.entries()) {
      if (tag) {
        if (pageRank.tags.includes(tag)) {
          if (pageRank.count > 0) {
            knownItems.push(pageRank)
          }
          knownUrls.add(url)
        }
      } else {
        if (pageRank.count > 0) {
          knownItems.push(pageRank)
        }
        knownUrls.add(url)
      }
    }

    return [
      // Raito降順の上位100件までを返す。
      knownItems.sort((a, b) => {
        // カウント、更新日降順
        return (a.ratio < b.ratio) ? 1 :
          (a.ratio > b.ratio) ? -1 :
          (a.updated_at < b.updated_at) ? 1 :
          (a.updated_at > b.updated_at) ? -1 :
          0
      })
      .slice(0, 100),
      knownUrls
    ]
  }
}
