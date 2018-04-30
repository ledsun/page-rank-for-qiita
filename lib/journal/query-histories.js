// インターフェースはSet風
module.exports = class {
  constructor() {
    this._orderSet = new Map()
  }
  values() {
    // 記事数の降順ソート
    return Array.from(this._orderSet.entries())
      .sort((a, b) => {
        if (a[1] > b[1]) return -1
        if (a[1] < b[1]) return 1
        return 0
      })
      .map(([query]) => query)
  }
  add(tag) {
    if (this._orderSet.has(tag)) {
      this._orderSet.set(tag, (this._orderSet.get(tag) + 1))
    } else {
      this._orderSet.set(tag, 1)
    }
  }
}
