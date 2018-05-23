// インターフェースはSet風
module.exports = class {
  constructor() {
    this._orderSet = new Map()
  }
  top(number) {
    return this._sort().slice(0, number)
  }
  add(url, tags) {
    for (const tag of tags) {
      if (!this._orderSet.has(tag)) {
        this._orderSet.set(tag, new Set())
      }
      // タグを持つ記事を数える
      this._orderSet.set(tag, this._orderSet.get(tag)
        .add(url))
    }
  }
  _sort() {
    // 記事数の降順ソート
    return this._dump
      .map(([tag, set]) => [tag, set.size])
      .sort((a, b) => {
        if (a[1] > b[1]) return -1
        if (a[1] < b[1]) return 1
        return 0
      })
  }
  get _dump() {
    return Array.from(this._orderSet.entries())
  }
}
