const LIMIT = 100

module.exports = class {
  constructor() {
    this._store = new Map()
    this._keys = []
  }
  set(key, value) {
    if (!this._store.has(key)) {
      if (this._keys.length >= LIMIT) {
        const oldest = this._keys.shift()
        this._store.delete(oldest)
      }
      this._keys.push(key)
    }

    this._store.set(key, value)

    return this
  }
  has(key) {
    return this._store.has(key)
  }
  get(key) {
    return this._store.get(key)
  }
  delete(key) {
    return this._store.delete(key)
  }
}
