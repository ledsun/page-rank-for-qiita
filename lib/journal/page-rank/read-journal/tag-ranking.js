// インターフェースはSet風
module.exports = class {
  constructor() {
    this._orderSet = new Map()
    this._values = []
  }
  values() {
    // レスポンスを早くするために、事前計算しておく
    return this._values
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

    process.nextTick(() => this._values = this._sort())
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
