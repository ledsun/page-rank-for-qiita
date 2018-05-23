const fs = require('fs')
const es = require('event-stream')

module.exports = function(itemsWithoutCountFile) {
  const data = fs.readFileSync(itemsWithoutCountFile, {
    encoding: 'utf8'
  })
  const urls = data.split('\n')
  const ignoreItems = new Set(urls)
  const existEntries = new Set(urls)

  return [ignoreItems, existEntries]
}
