module.exports = function(references, user) {
  return references
    .filter((url) => {
      const match = /^\/([\d\w@-]+)\//.exec(url)
      return match[1] !== user
    })
}
