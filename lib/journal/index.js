const fs = require('fs')
const os = require('os')
const es = require('event-stream')
const QueryHistories = require('./query-histories')
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
  pageRanks,
  queryHistories,
  existEntries
} = read()

module.exports = {
  pageRanks,
  queryHistories,
  write,
  pageRanksForView(tag) {
    const pageRanksForView = []
    const knownUrls = new Set()
    for (const [url, pageRank] of pageRanks.entries()) {
      if (tag) {
        if (pageRank.tags.includes(tag)) {
          if (pageRank.count > 0) {
            pageRanksForView.push(pageRank)
          }
          knownUrls.add(url)
        }
      } else {
        if (pageRank.count > 0) {
          pageRanksForView.push(pageRank)
        }
        knownUrls.add(url)
      }
    }

    return [
      pageRanksForView.sort((a, b) => {
        // カウント、更新日降順
        return (a.ratio < b.ratio) ? 1 :
          (a.ratio > b.ratio) ? -1 :
          (a.updated_at < b.updated_at) ? 1 :
          (a.updated_at > b.updated_at) ? -1 :
          0
      })
      .slice(0, 100),
      knownUrls
    ]
  }
}

function read() {
  const pageRanks = new Map()
  const queryHistories = new QueryHistories()
  const existEntries = new Set()

  const s = fs.createReadStream(file, {
      encoding: 'utf8'
    })
    .pipe(es.split())
    .pipe(es.mapSync((line) => {
        // pause the readstream
        s.pause()

        const [url, title, count, content_length, tags, created_at, updated_at] = line.split('\t')
        // 稀に空行があるらしい
        if (url) {
          const tagArray = tags.split(',')

          if (Number(count)) {
            queryHistories.add(url, tagArray)
          }

          if (url) {
            pageRanks.set(url, {
              title,
              url,
              count: Number(count),
              content_length,
              ratio: calculatePageRank(count, content_length),
              tags: tagArray.map((t) => t.toLowerCase()),
              created_at,
              updated_at
            })
          }

          existEntries.add(`${url}`)
        }

        // resume the readstream, possibly from a callback
        s.resume()
      })
      .on('error', (err) => console.log(new Date(), 'Error while reading file.', err))
      .on('end', () => console.log(new Date(), 'Read journal file.'))
    )

  return {
    pageRanks,
    queryHistories,
    existEntries
  }
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
    pageRanks.set(url, {
      title,
      url,
      count,
      content_length,
      ratio: calculatePageRank(count, content_length),
      tags,
      created_at,
      updated_at
    })
  }
  // ジャーナルの重複防止
  if (!existEntries.has(`${url}`)) {
    stream.write(`${url}\t${title}\t${count}\t${content_length}\t${tags.join(',')}\t${created_at}\t${updated_at}\n`)
    existEntries.add(`${url}`)
  }
}
