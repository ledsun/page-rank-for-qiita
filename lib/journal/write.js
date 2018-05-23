const toSafeTitle = require('./to-safe-title')
const updateMemoryCache = require('./update-memory-cache')

// メモリ上のキャッシュオブジェクトの更新とジャーナルファイルの書き込みを両方行う
module.exports = function(queryHistories, itemMap, existEntries, journalStream, itmesWithoutCountStream, data) {
  updateMemoryCache(queryHistories, itemMap, data)
  writeFile(existEntries, journalStream, itmesWithoutCountStream, data)
}


function writeFile(existEntries, journalStream, itmesWithoutCountStream, {
  url,
  title,
  count,
  articleLength,
  tags,
  updated_at
}) {
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
