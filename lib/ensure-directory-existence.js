const fs = require('fs')
const path = require('path')

module.exports = ensureDirectoryExistence

function ensureDirectoryExistence(filePath) {
  if (filePath.endsWith('/')) {
    filePath += 'dummy'
  }

  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}
