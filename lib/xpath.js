const libxmljs = require('libxmljs')

module.exports = function(htmlString, xpath){
  const xmlDoc = libxmljs.parseHtmlString(htmlString)
  return xmlDoc.get(xpath)
}
