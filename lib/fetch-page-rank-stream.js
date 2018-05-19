const os = require('os')
const {
  Transform
} = require('stream')
const fetchPageRank = require('./fetch-page-rank')

module.exports = class extends Transform {
  constructor({
    itemMap,
    ignoreItems
  }) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
    this._itemMap = itemMap
    this._ignoreItems = ignoreItems
  }

  async _transform(chunk, encoding, callback) {
    const {
      url,
      user
    } = chunk

    this.push(Object.assign({}, chunk, await fetchInfo(this._ignoreItems, this._itemMap, url, user)))

    callback()
  }
}

async function fetchInfo(ignoreItems, itemMap, url, user) {
  if (ignoreItems.has(url)) {
    // すでにカウント数が0だとわかっている
    return {
      count: 0,
      articleLength: 0
    }
  } else {
    // 毎回スクレイピングしていると遅い。キャッシュを参照する
    const [count, articleLength] = itemMap.has(url) ? [itemMap.get(url)
        .count, itemMap.get(url)
        .articleLength
      ] :
      await fetchPageRank(url, user)

    return {
      count,
      articleLength
    }
  }
}
