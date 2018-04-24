const fs = require('fs')
const handlebars = require('handlebars')

const index_file = `${__dirname}/../../public/index.html`
const html = fs.readFileSync(index_file, 'utf8')
const template = handlebars.compile(html)

module.exports = function(req, res) {
  const body = template({
    googleAnalitycsTrackingID: process.env.TRACKING_ID
  })

  res.setHeader('Content-Type', 'text/html')
  res.status = 200
  res.end(body)
}
