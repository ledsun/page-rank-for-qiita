const os = require('os')
const JSONStore = require('json-store')
const db = JSONStore(`${os.tmpdir()}/page-rank-for-qiita__query-history.json`)

module.exports = class QueryHistory {
  static push(tag) {
    const queue = QueryHistory._queue
    queue[tag] = true
    db.set('queue', queue)
  }
  static pop() {
    return Object.keys(QueryHistory._queue).slice(0, 20)
  }
  static get _queue() {
    return db.get('queue') || {}
  }
}
