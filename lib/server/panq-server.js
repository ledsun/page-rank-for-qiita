const parser = require('url')
const sendIndex = require('./send-index')
const logMemoryUsage = require('./log-memory-usage')

module.exports = function(sessionStore, journal) {
  return (req, res, next) => {
    const url = parser.parse(req.url, true)
    if (url.pathname === '/' || url.pathname === '/index.html') {
      logMemoryUsage('start-idenx.html')
      const tag = (url.query.tag || '')
        .toLowerCase()
      const [sessionId, knownUrls] = sendIndex(req, res, journal, tag)
      sessionStore.set(sessionId, {
        tag: tag || '',
        knownUrls
      })
      logMemoryUsage('finish-idenx.html')
    } else {
      next()
    }
  }
}
