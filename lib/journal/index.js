const fs = require('fs')
const os = require('os')
const read = require('./read')
const write = require('./write')

const journalFile = `${process.cwd()}/data/page-rank-for-qiita__page-rank.tsv`
const itemsWithoutCountFile = `${process.cwd()}/data/page-rank-for-qiita__items-without-count.text`
const fileOption = {
  flags: 'a'
}
const journalStream = fs.createWriteStream(journalFile, fileOption)
const itemsWithoutCountStream = fs.createWriteStream(itemsWithoutCountFile, fileOption)

// サーバ終了時にflashする
process.on('SIGINT', () => {
  console.log(new Date(), 'CLOSING [SIGINT]')
  journalStream.end()
  itemsWithoutCountStream.end()
  process.exit()
})

const {
  itemMap,
  queryHistories,
  existEntries
} = read(journalFile)

module.exports = {
  itemMap,
  queryHistories,
  write: (data) => write(queryHistories, itemMap, existEntries, journalStream, itemsWithoutCountStream, data)
}
