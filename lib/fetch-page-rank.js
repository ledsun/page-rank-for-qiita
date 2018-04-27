const rp = require('request-promise')
const sleep = require('sleep-promise')
const countReferences = require('./count-references')
const fs = require('fs')
const path = require('path')

const WAIT = 200
let requesting = 0

module.exports = async function(url, user) {
  return await fetch(url, user)
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

async function fetch(uri, user, retry = 1) {
  try {
    requesting += 1
    // console.log('now requesting :', requesting)
    // Qiitaに負荷を掛けすぎないように、一回読んだら少し休む。
    const body = await rp({
      uri,
      gzip: true,
      forever: true
    })

    const count = countReferences(body, user)
    if(count){
      const file = `${__dirname}/../public/cache/${uri.replace('https://qiita.com', '')}.html`
      ensureDirectoryExistence(file)
      fs.writeFile(file, body, (err) => {if (err) console.error(err)})
    }

    await sleep(100)
    return count
  } catch (e) {
    if (e.name === 'RequestError') {
      console.log(e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.log(e.name, e.statusCode, e.options.uri)
      if(e.statusCode === 404){
        // アカウントがbangされた時は記事が404なる
        return 0
      }
    } else {
      console.error(uri, user)
      console.error(e)
    }

    const duration = WAIT * requesting * retry
    console.log(`sleep item: ${duration}ms`)
    await sleep(duration)
    if (retry <= 3) {
      console.log('do retry', uri)
      return await fetch(uri, user, retry + 1)
    } else {
      console.error('give up to retry', uri)
    }
  } finally {
    requesting -= 1
    // console.log('now requesting :', requesting)
  }
}
