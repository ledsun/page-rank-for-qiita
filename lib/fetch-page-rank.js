const rp = require('request-promise')
const sleep = require('sleep-promise')
const countReferences = require('./count-references')

const WAIT = 200
let requesting = 0

module.exports = async function(url, user) {
  return await fetch(url, user)
}

async function fetch(url, user, retry = 1) {
  try {
    requesting += 1
    // console.log('now requesting :', requesting)
    // Qiitaに負荷を掛けすぎないように、一回読んだら少し休む。
    const body = await rp(url)
    await sleep(50)
    return countReferences(body, user)
  } catch (e) {
    if (e.name === 'RequestError') {
      console.log(e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.log(e.name, e.statusCode, e.options.uri)
    } else {
      console.error(url, user)
      console.error(e)
    }

    const duration = WAIT * requesting * retry
    console.log(`sleep item: ${duration}ms`)
    await sleep(duration)
    if (retry <= 3) {
      console.log('do retry')
      return await fetch(url, user, retry + 1)
    }
  } finally {
    requesting -= 1
    // console.log('now requesting :', requesting)
  }
}
