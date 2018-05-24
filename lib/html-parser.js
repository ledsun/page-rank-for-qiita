const libxmljs = require('libxmljs')

module.exports = {
  parse,
  query
}

function parse(body) {
  return libxmljs.parseHtmlString(body)
}

function query(xpath, doc) {
  return doc.find(xpath)
}
