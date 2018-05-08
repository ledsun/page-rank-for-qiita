const fs = require('fs')
const os = require('os')
const read = require('./read')
const calculatePageRank = require('../calculate-page-rank')

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
  write
}

function write({
  title,
  url,
  count,
  content_length,
  tags,
  created_at,
  updated_at
}) {
  // 参照があるときにクエリヒストリとして保存
  if (count) {
    queryHistories.add(url, tags)
  }
  // urlが取れたらページランクを保存
  if (url) {
    itemMap.set(url, title, count, content_length, tags, created_at, updated_at)
  }
  // ジャーナルの重複防止
  if (!existEntries.has(`${url}`)) {
    stream.write(`${url}\t${title}\t${count}\t${content_length}\t${tags.join(',')}\t${created_at}\t${updated_at}\n`)
    existEntries.add(`${url}`)
  }
}
