// Qiitaの記事タイトルは末尾に改行がつくことがある
// see: https://qiita.com/diskshima/items/a80d2d0625a8d81e5c8a
module.exports = function(title) {
  return title.trim()
}
