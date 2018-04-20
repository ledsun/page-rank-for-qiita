const getUrlFromReference = require('./get-url-from-reference')

module.exports = function(references, user) {
  return references
    .filter((node) => {
      const referenceUrl = getUrlFromReference(node)
      const match = /^\/([\d\w@-]+)\//.exec(referenceUrl)
      return match[1] !== user
    })
}
