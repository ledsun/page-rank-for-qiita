const getUrlFromReference = require('./get-url-from-reference')

module.exports = function(references, user) {
  return references
    .filter((attribute) => {
      const referenceUrl = attribute.value()
      const match = /^\/([\d\w@-]+)\//.exec(referenceUrl)
      return match[1] !== user
    })
}
