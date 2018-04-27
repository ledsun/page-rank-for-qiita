const rp = require('request-promise')
const sleep = require('sleep-promise')

module.exports = async function recentItems(perPage = 10, page = 1, tag = null) {
  const uri = `https://qiita.com/api/v2/items?page=${page}&per_page=${perPage}${ tag ? `&query=tag%3A${encodeURIComponent(tag)}` : '' }`
  return fetch(uri)
}

async function fetch(uri, retry = false) {
  try {
    const body = await rp({
      uri,
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
      },
      gzip: true,
      forever: true
    })

    return JSON.parse(body)
      .map(r => ({
        url: r.url,
        user: r.user.id,
        title: r.title,
        tags: r.tags.map((t) => t.name)
      }))
  } catch (e) {
    if (e.name === 'RequestError') {
      console.log(e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.log(e.name, e.statusCode, e.options.uri)
    } else {
      console.error(uri)
      console.error(e)
    }

    const duration = 1000
    console.log(`sleep recent items: ${duration}ms`)
    await sleep(duration)
    if (!retry) {
      console.log('do retry', uri)
      return await fetch(uri, true)
    } else {
      console.error('give up to retry', uri)
    }
  }
}
