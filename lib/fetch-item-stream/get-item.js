const fetchItem = require('./fetch-item')

module.exports = async function(ignoreItems, url) {
  if (ignoreItems.has(url)) {
    // すでにカウント数が0だとわかっている
    return {
      body: ''
    }
  } else {
    return await fetchItem(url)
  }
}
