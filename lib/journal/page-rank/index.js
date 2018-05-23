const fs = require('fs')
const ensureDirectoryExistence = require('../../ensure-directory-existence')
const readJournal = require('./read-journal')
const writeJournal = require('./write-journal')

module.exports = function() {
  ensureDirectoryExistence(`${process.cwd()}/data/`)
  const file = `${process.cwd()}/data/page-rank-for-qiita__page-rank.tsv`
  const {
    itemMap,
    tagRanking,
    existEntries
  } = readJournal(file)
  const stream = fs.createWriteStream(file, {
    flags: 'a'
  })

  return {
    itemMap,
    tagRanking,
    write(data) {
      writeJournal(existEntries, stream, data)
    },
    end() {
      stream.end()
    }
  }
}
