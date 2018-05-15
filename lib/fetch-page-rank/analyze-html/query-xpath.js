const xpath = require('xpath')
const parse5 = require('parse5')
const xmlser = require('xmlserializer')
const {
  DOMParser
} = require('xmldom')

module.exports = function(htmlString, xpathString) {
  const document = parse5.parse(htmlString)
  const xhtml = xmlser.serializeToString(document)
  const doc = new DOMParser()
    .parseFromString(xhtml)
  const select = xpath.useNamespaces({
    "x": "http://www.w3.org/1999/xhtml"
  })
  return select(xpathString, doc)
}
