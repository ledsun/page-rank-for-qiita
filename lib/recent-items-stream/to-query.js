module.exports = function(tag) {
  const tags = tag.split(/\s+/)
  return `query=${tags.map((tag) => `tag%3A${encodeURIComponent(tag)}`)}`
}
