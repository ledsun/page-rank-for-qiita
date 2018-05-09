const rp = require('request-promise')
const sleep = require('sleep-promise')

module.exports = async function recentItems(perPage = 10, page = 1, tag = null) {
  const tags = tag.split(/\s+/)
  const uri = `https://qiita.com/api/v2/items?page=${page}&per_page=${perPage}${ tags ? `&query=${tags.map((tag) => `tag%3A${encodeURIComponent(tag)}`).join('+')}` : '' }`
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

    // tagsはversionsを持っているが、今は使われていないようだ
    // "tags":[{"name":"MySQL","versions":[]},{"name":"SQLServer","versions":[]},{"name":"PostgreSQL","versions":[]}
    return JSON.parse(body)
      .map(r => ({
        url: r.url,
        user: r.user.id,
        title: r.title,
        tags: r.tags.map((t) => t.name),
        created_at: r.created_at,
        updated_at: r.updated_at
      }))
  } catch (e) {
    if (e.name === 'RequestError') {
      console.log(new Date(), e.name, e.message, e.options.uri)
    } else if (e.name === 'StatusCodeError') {
      // messageはHTML本文が入っているため出力しない
      console.log(new Date(), e.name, e.statusCode, e.options.uri)

      // API制限に引っかかった時は、3600s（1000件/時間）待ちます。
      if(e.statusCode === 403) {
        console.log(new Date(), 'sleep 3600s for API limit')
        await sleep(3600)
      }
    } else {
      console.error(new Date(), uri)
      console.error(new Date(), e)
    }

    const duration = 1000
    console.log(new Date(), `sleep recent items: ${duration}ms`)
    await sleep(duration)
    if (!retry) {
      console.log(new Date(), 'do retry', uri)
      return await fetch(uri, true)
    } else {
      console.error(new Date(), 'give up to retry', uri)
    }
  }
}
