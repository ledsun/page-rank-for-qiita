const rp = require('request-promise')
const sleep = require('sleep-promise')
const ensureDirectoryExistence = require('../ensure-directory-existence')
const analyzeHtml = require('./analyze-html')
const fs = require('fs')
const path = require('path')

const WAIT = 200
let requesting = 0

module.exports = fetch

async function fetch(uri, user, retry = 1) {
  try {
    requesting += 1
    // console.log(new Date(), 'now requesting :', requesting)
    // Qiitaに負荷を掛けすぎないように、一回読んだら少し休む。
    const body = await rp({
      uri,
      gzip: true,
      forever: true
    })

    const [count, articleLength] = analyzeHtml(body, user)
    if (count) {
      const file = path.join(`${process.cwd()}/data/public/cache`, `${uri.replace('https://qiita.com', '')}.html`)
      ensureDirectoryExistence(file)
      fs.writeFile(file, body, (err) => {
        if (err) console.error(new Date(), err)
      })
    }

    await sleep(100)
    return {
      count,
      articleLength
    }
  } catch (e) {
    if (e.name === 'RequestError') {
      console.log(new Date(), e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.log(new Date(), e.name, e.statusCode, e.options.uri)
      if (e.statusCode === 404) {
        // アカウントがbangされた時は記事が404なる
        return {
          count: 0,
          articleLength: 0
        }
      }
    } else {
      console.error(new Date(), uri, user)
      console.error(new Date(), e)
    }

    const duration = WAIT * requesting * retry
    console.log(new Date(), `sleep item: ${duration}ms`)
    await sleep(duration)
    if (retry <= 3) {
      console.log(new Date(), 'do retry', uri)
      return await fetch(uri, user, retry + 1)
    } else {
      console.error(new Date(), 'give up to retry', uri)
      return {
        count: 0,
        articleLength: 0
      }
    }
  } finally {
    requesting -= 1
    // console.log(new Date(), 'now requesting :', requesting)
  }
}
