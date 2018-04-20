const rp = require('request-promise')
const sleep = require('sleep-promise')
const countReferences = require('./count-references')

const WAIT = 200
let requesting = 0

module.exports = async function(url, user) {
  return await fetch(url, user)
}

async function fetch(url, user, retry = false){
  try {
    requesting += 1
    // console.log('now requesting :', requesting)
    const body = await rp(url)
    return countReferences(body, user)
  } catch (e) {
    if (e.name === 'RequestError') {
      console.error(e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.error(e.name, e.statusCode, e.options.uri)
    } else {
      console.log(url, user)
      console.error(e)
    }

    const duration = WAIT * requesting
    console.log(`sleep: ${duration}ms`)
    await sleep(duration)
    if(!retry) {
      console.log('do retry')
      return await fetch(url, user, true)
    }
  } finally {
    requesting -= 1
    // console.log('now requesting :', requesting)
  }
}
