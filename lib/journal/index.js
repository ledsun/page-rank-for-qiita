const fs = require('fs')
const os = require('os')
const es = require('event-stream')
const QueryHistories = require('./query-histories')

const file = `${os.tmpdir()}/page-rank-for-qiita__page-rank.tsv`
const stream = fs.createWriteStream(file, {
  flags: 'a'
})

// サーバ終了時にflashする
process.on('SIGINT', () => {
  console.log('CLOSING [SIGINT]')
  stream.end()
  process.exit()
})

const {
  pageRanks,
  queryHistories,
  existEntries
} = read()

module.exports = {
  pageRanks,
  queryHistories,
  write
}

function read() {
  const pageRanks = new Map()
  const queryHistories = new QueryHistories()
  const existEntries = new Set()
  const hoge = new Map()

  const s = fs.createReadStream(file, {
      encoding: 'utf8'
    })
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
        s.pause()

        const [tag, url, count] = line.split('\t')
        if (tag && Number(count)) {
          queryHistories.add(tag)
        }

        if (url) {
          pageRanks.set(url, Number(count))
        }

        existEntries.add(`${tag}${url}`)

        // resume the readstream, possibly from a callback
        s.resume()
      })
      .on('error', (err) => console.log('Error while reading file.', err))
      .on('end', () => console.log('Read journal file.'))
    )

  return {
    pageRanks,
    queryHistories,
    existEntries
  }
}

function write({
  tag,
  url,
  count
}) {
  // 参照があるときにクエリヒストリとして保存
  if (count) {
    queryHistories.add(tag)
  }
  // urlが取れたらページランクを保存
  if (url) {
    pageRanks.set(url, count)
  }
  // ジャーナルの重複防止
  if (!existEntries.has(`${tag}${url}`)) {
    stream.write(`${tag}\t${url}\t${count}\n`)
  }
}
