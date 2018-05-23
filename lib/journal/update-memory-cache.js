const toSafeTitle = require('./to-safe-title')

module.exports = function(queryHistories, itemMap, {
  title,
  url,
  count,
  articleLength,
  ratio,
  tags,
  updated_at
}) {
  // 参照があるときにクエリヒストリとして保存
  if (ratio) {
    queryHistories.add(url, tags)
  }

  itemMap.set(url, toSafeTitle(title), count, articleLength, ratio, tags, updated_at)
}
