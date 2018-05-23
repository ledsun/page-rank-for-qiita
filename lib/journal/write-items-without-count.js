const toSafeTitle = require('./to-safe-title')

module.exports = function(existEntries, itemsWithoutCountStream, {
  url,
  count
}) {
  if (!count) {
    // ジャーナルの重複防止
    if (!existEntries.has(`${url}`)) {
      itemsWithoutCountStream.write(`${url}\n`)
      existEntries.add(`${url}`)
    }
  }
}
