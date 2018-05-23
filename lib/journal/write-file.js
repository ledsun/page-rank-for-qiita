const toSafeTitle = require('./to-safe-title')

module.exports = function(existEntries, journalStream, itmesWithoutCountStream, {
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
