const JSONStore = require('json-store');
const db = JSONStore('/tmp/page-rank.json');
const recentItems = require('./recent-items');
const fetchPageRank = require('./fetch-page-rank');

module.exports = async function crawle(page, tag) {
  const urls = await recentItems(100, page, tag)
  const items = []
  for (const {
      title,
      url,
      user
    } of urls) {

    // 毎回スクレイピングしていると遅いので、キャッシュする
    let count = db.get(url)
    if (count === undefined) {
      count = await fetchPageRank(url, user)
    }
    db.set(url, count)

    items.push({
      title,
      url,
      count
    })
  }

  return items
}
