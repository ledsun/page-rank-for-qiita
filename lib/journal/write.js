const toSafeTitle = require('./to-safe-title')

// メモリ上のキャッシュオブジェクトの更新とジャーナルファイルの書き込みを両方行う
module.exports = function(queryHistories, itemMap, existEntries, journalStream, itmesWithoutCountStream, {
  title,
  url,
  count,
  articleLength,
  ratio,
  tags,
  created_at,
  updated_at
}) {
  // 参照があるときにクエリヒストリとして保存
  if (ratio) {
    queryHistories.add(url, tags)
  }
  // urlが取れたらページランクを保存
  if (url) {
    itemMap.set(url, toSafeTitle(title), count, articleLength, ratio, tags, updated_at)

    // ジャーナルの重複防止
    if (!existEntries.has(`${url}`)) {
      if (count) {
        journalStream.write(`${url}\t${toSafeTitle(title)}\t${count}\t${articleLength}\t${tags.join(',')}\t${updated_at}\n`)
      } else {
        itmesWithoutCountStream.write(`${url}\n`)
      }
      existEntries.add(`${url}`)
    }
  }
}
