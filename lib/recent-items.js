const os = require('os')
const rp = require('request-promise')
const JSONStore = require('json-store')
const db = JSONStore(`${os.tmpdir()}/page-rank-for-qiita__recent-items.json`)

module.exports = async function recentItems(perPage = 10, page = 1, tag = null) {
  const uri = `https://qiita.com/api/v2/items?page=${page}&per_page=${perPage}${ tag ? `&query=tag%3A${tag}` : '' }`
  try {
    let body = db.get(uri)
    if (body === undefined) {
      body = await rp({
        uri,
        headers: {
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        }
      })
      db.set(uri, body)
    }

    return JSON.parse(body)
      .map(r => ({
        url: r.url,
        user: r.user.id,
        title: r.title
      }))
  } catch (e) {
    if (e.name === 'RequestError') {
      console.error(e.name, e.message, e.options.uri)
    } else {
      console.log(uri, user)
      console.error(e)
    }
  }
}
