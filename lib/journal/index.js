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
  pageRanks,
  queryHistories,
  existEntries
} = read(file)

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
