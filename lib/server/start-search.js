const search = require('./search')

module.exports = function(message, wsConnection, journal, max) {
  const tag = message.toLowerCase()
  search(tag, wsConnection, journal, max)
}
