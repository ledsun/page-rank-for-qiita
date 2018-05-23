const fs = require('fs')
const handlebars = require('handlebars')
const uuidv1 = require('uuid/v1')

const index_file = `${__dirname}/../../public/index.html`
const html = fs.readFileSync(index_file, 'utf8')
const template = handlebars.compile(html)

module.exports = function(req, res, {
  tagRanking,
  itemMap
}, tag) {
  const recentTags = tagRanking.top(12)
    .map(([tag, count]) => ({
      encoded: encodeURIComponent(tag),
      tag,
      count
    }))
  const sessionId = uuidv1()
  const {
    knownItems,
    knownUrls
  } = itemMap.getKnowledges(tag)
  const body = template({
    googleAnalitycsTrackingID: process.env.TRACKING_ID,
    recentTags,
    knownItems,
    tag: tag ? tag : 'オールジャンル',
    sessionId,
    knownUrls: knownUrls.size
  })

  res.setHeader('Content-Type', 'text/html')
  res.status = 200
  res.end(body)

  return [sessionId, knownUrls]
}
