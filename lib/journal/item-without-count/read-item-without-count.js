const fs = require('fs')

module.exports = function(file) {
  const urls = read(file)
  const ignoreItems = new Set(urls)
  const existEntries = new Set(urls)

  return [ignoreItems, existEntries]
}

function read(file) {
  try {
    const data = fs.readFileSync(file, {
      encoding: 'utf8'
    })
    return data.split('\n')
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(new Date(), 'item-without-count file does not exist', file)
    } else {
      console.error(new Date(), 'Error while reading file.', e)
    }
    return []
  }
}
