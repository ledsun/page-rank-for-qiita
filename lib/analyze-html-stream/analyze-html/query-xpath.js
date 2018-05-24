const xpath = require('xpath')
const parse5 = require('parse5')
const xmlser = require('xmlserializer')
const {
  DOMParser
} = require('xmldom')

const query = xpath.useNamespaces({
  "x": "http://www.w3.org/1999/xhtml"
})

module.exports = queryXpath
module.exports.parse = parse
module.exports.query = query

function queryXpath(htmlString, xpathString) {
  try {
    const doc = parse(htmlString)
    return query(xpathString, doc)
  } catch (e) {
    console.error(new Date(), e)
    return []
  }
}

function parse(htmlString) {
  const document = parse5.parse(htmlString)
  const xhtml = xmlser.serializeToString(document)
  const doc = new DOMParser()
    .parseFromString(xhtml)
  return doc
}
