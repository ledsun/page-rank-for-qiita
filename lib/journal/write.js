// メモリ上のキャッシュオブジェクトの更新とジャーナルファイルの書き込みを両方行う
module.exports = function(queryHistories, itemMap, existEntries, stream, {
  title,
  url,
  count,
  content_length,
  tags,
  created_at,
  updated_at
}) {
  // 参照があるときにクエリヒストリとして保存
  if (count) {
    queryHistories.add(url, tags)
  }
  // urlが取れたらページランクを保存
  if (url) {
    itemMap.set(url, title, count, content_length, tags, updated_at)
  }
  // ジャーナルの重複防止
  if (!existEntries.has(`${url}`)) {
    stream.write(`${url}\t${title}\t${count}\t${content_length}\t${tags.join(',')}\t${created_at}\t${updated_at}\n`)
    existEntries.add(`${url}`)
  }
}
