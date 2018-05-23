const fs = require('fs')
const ensureDirectoryExistence = require('../../ensure-directory-existence')
const readJournal = require('./read-journal')
const writeJournal = require('./write-journal')

module.exports = function() {
  ensureDirectoryExistence(`${process.cwd()}/data/`)
  const journalFile = `${process.cwd()}/data/page-rank-for-qiita__page-rank.tsv`
  const fileOption = {
    flags: 'a'
  }
  const journalStream = fs.createWriteStream(journalFile, fileOption)

  const existEntries1 = new Set()
  const {
    itemMap,
    queryHistories
  } = readJournal(journalFile, existEntries1)

  return {
    itemMap,
    queryHistories,
    write(data) {
      writeJournal(existEntries1, journalStream, data)
    },
    end() {
      journalStream.end()
    }
  }
}
