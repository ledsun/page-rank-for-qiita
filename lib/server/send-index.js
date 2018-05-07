const fs = require('fs')
const handlebars = require('handlebars')

const index_file = `${__dirname}/../../public/index.html`
const html = fs.readFileSync(index_file, 'utf8')
const template = handlebars.compile(html)

module.exports = function(req, res, {
  queryHistories,
  pageRanks
}) {
  const recentTags = []

  for (const [tag, count] of queryHistories.values()) {
    if (recentTags.length > 12) {
      break;
    }

    recentTags.push({
      encoded: encodeURIComponent(tag),
      tag,
      count
    })
  }

  const pageRanksForView = []
  for (const [url, pageRank] of pageRanks.entries()) {
    if (pageRank.count > 0) {
      pageRanksForView.push(pageRank)
    }
  }

  const body = template({
    googleAnalitycsTrackingID: process.env.TRACKING_ID,
    recentTags,
    pageRanks: pageRanksForView
  })

  res.setHeader('Content-Type', 'text/html')
  res.status = 200
  res.end(body)
}
