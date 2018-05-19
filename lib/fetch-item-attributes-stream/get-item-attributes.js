const fetchItemAttributes = require('../fetch-item-attributes')

module.exports = async function(ignoreItems, itemMap, url, user) {
  if (ignoreItems.has(url)) {
    // すでにカウント数が0だとわかっている
    return {
      count: 0,
      articleLength: 0
    }
  } else {
    // 毎回スクレイピングしていると遅い。キャッシュを参照する
    if (itemMap.has(url)) {
      return itemMap.get(url)
    } else {
      return await fetchItemAttributes(url, user)
    }
  }
}
