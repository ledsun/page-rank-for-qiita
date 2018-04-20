module.exports = function(node) {
  const aTag = node.childNodes[1]
  return aTag.getAttribute('href')
}
