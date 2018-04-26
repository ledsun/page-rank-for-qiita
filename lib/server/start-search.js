const search = require('./search')

module.exports = function(message, wsConnection, journal) {
  const tag = message.toLowerCase()
  search(tag, wsConnection, journal)
}
