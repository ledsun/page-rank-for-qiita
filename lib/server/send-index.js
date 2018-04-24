const fs = require('fs')
const handlebars = require('handlebars')
const queryHistory = require('./query-history')

const index_file = `${__dirname}/../../public/index.html`
const html = fs.readFileSync(index_file, 'utf8')
const template = handlebars.compile(html)

module.exports = function(req, res) {
  const recentTags = queryHistory.pop()
    .map((tag) => ({
      encoded: encodeURIComponent(tag),
      tag
    }))

  const body = template({
    googleAnalitycsTrackingID: process.env.TRACKING_ID,
    recentTags
  })

  res.setHeader('Content-Type', 'text/html')
  res.status = 200
  res.end(body)
}
