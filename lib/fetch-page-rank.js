const rp = require('request-promise')
const countReferences = require('./count-references')

let requesting = 0

module.exports = async function(url, user) {
  try {
    requesting += 1
    console.log('now requesting :', requesting)
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
  } finally {
    requesting -= 1
    console.log('now requesting :', requesting)
  }
}
