module.exports = function(store, tag) {
  const knownItems = []
  const knownUrls = new Set()
  for (const [url, pageRank] of store.entries()) {
    if (tag) {
      if (pageRank.tags.includes(tag)) {
        if (pageRank.ratio > 0) {
          knownItems.push(pageRank)
        }
        knownUrls.add(url)
      }
    } else {
      if (pageRank.ratio > 0) {
        knownItems.push(pageRank)
      }
      knownUrls.add(url)
    }
  }

  return {
    knownItems,
    knownUrls
  }
}
