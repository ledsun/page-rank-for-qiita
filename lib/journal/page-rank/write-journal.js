const toSafeTitle = require('../to-safe-title')

module.exports = function(existEntries, journalStream, {
  ratio,
  url,
  title,
  count,
  articleLength,
  tags,
  updated_at
}) {
  if (ratio > 0) {
    // ジャーナルの重複防止
    if (!existEntries.has(`${url}`)) {
      journalStream.write(`${url}\t${toSafeTitle(title)}\t${count}\t${articleLength}\t${tags.join(',')}\t${updated_at}\n`)
      existEntries.add(`${url}`)
    }
  }
}
