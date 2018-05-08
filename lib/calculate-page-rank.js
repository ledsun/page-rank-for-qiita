module.exports = function(count, content_length) {
  return Number((count / content_length * 100000)
    .toFixed(2))
}
