const rp = require('request-promise')
const sleep = require('sleep-promise')

const WAIT = 200
let requesting = 0

module.exports = fetch

async function fetch(uri, retry = 1) {
  try {
    requesting += 1
    // console.log(new Date(), 'now requesting :', requesting)
    const body = await rp({
      uri,
      gzip: true,
      forever: true
    })

    // Qiitaに負荷を掛けすぎないように、一回読んだら少し休む。
    await sleep(100)
    return body
  } catch (e) {
    if (e.name === 'RequestError') {
      console.log(new Date(), e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.log(new Date(), e.name, e.statusCode, e.options.uri)
      if (e.statusCode === 404) {
        // アカウントがbangされた時は記事が404なる
        return ''
      }
    } else {
      console.error(new Date(), uri)
      console.error(new Date(), e)
    }

    const duration = WAIT * requesting * retry
    console.log(new Date(), `sleep item: ${duration}ms`)
    await sleep(duration)
    if (retry <= 3) {
      console.log(new Date(), 'do retry', uri)
      return await fetch(uri, retry + 1)
    } else {
      console.error(new Date(), 'give up to retry', uri)
      return ''
    }
  } finally {
    requesting -= 1
    // console.log(new Date(), 'now requesting :', requesting)
  }
}
