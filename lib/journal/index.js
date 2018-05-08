const fs = require('fs')
const os = require('os')
const read = require('./read')
const write = require('./write')

const file = `${os.tmpdir()}/page-rank-for-qiita__page-rank.tsv`
const stream = fs.createWriteStream(file, {
  flags: 'a'
})

// サーバ終了時にflashする
process.on('SIGINT', () => {
  console.log(new Date(), 'CLOSING [SIGINT]')
  stream.end()
  process.exit()
})

const {
  itemMap,
  queryHistories,
  existEntries
} = read(file)

module.exports = {
  itemMap,
  queryHistories,
  write: (data) => write(queryHistories,itemMap, existEntries, stream,  data)
}
