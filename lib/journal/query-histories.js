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
  add(tags) {
    for (const tag of tags) {
      if (this._orderSet.has(tag)) {
        this._orderSet.set(tag, (this._orderSet.get(tag) + 1))
      } else {
        this._orderSet.set(tag, 1)
      }
    }

    process.nextTick(() => this._values = this._calculate())
  }
  _calculate() {
    // 記事数の降順ソート
    return this._dump
      .filter(([tag, count]) => count > 16)
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
