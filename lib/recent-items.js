const rp = require('request-promise')
const JSONStore = require('json-store');
const db = JSONStore('/tmp/recent-items.json');

module.exports = async function recentItems(perPage = 10, page = 1, tag = null) {
  const uri = `https://qiita.com/api/v2/items?page=${page}&per_page=${perPage}${ tag ? `&query=tag%3A${tag}` : '' }`
  try {

    let body = db.get(uri)
    if(body === undefined){
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
    console.log(uri);
    console.error(e);
  }
}
