const os = require('os')
const {
  Transform
} = require('stream')
const fetchItemAttributes = require('./fetch-item-attributes')

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

    this.push(Object.assign({}, chunk, await getPageInfo(this._ignoreItems, this._itemMap, url, user)))

    callback()
  }
}

async function getPageInfo(ignoreItems, itemMap, url, user) {
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
