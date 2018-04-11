const rp = require('request-promise')
const sleep = require('sleep-promise')
const handlebars = require('handlebars')
const _ = require('lodash')
const JSONStore = require('json-store');
const db = JSONStore('/tmp/page-rank.json');
const fetchPageRank = require('./fetch-page-rank');

const template = handlebars.compile(`
|記事|ページランク|
|---|---|
{{#each this}}
|[{{title}}]({{url}})|{{count}}|
{{/each}}
`)

const TAG = process.argv[2]

;
(async () => {
  let ret = []
  // ITEM APIに指定するページの範囲
  // 1リクエストあたり100件の制限があるので、ページ数を変えて繰り返し実行します。
  for (page of _.range(1, 10)) {
    console.log('page', page);
    ret = ret.concat(await crawle(page))
  }
  console.log(template(ret.filter(r => r.count > 0)));
})()

async function crawle(page) {
  const urls = await recentItems(100, page, TAG)
  const items = []
  for (const {
      title,
      url,
      user
    } of urls) {

    // 毎回スクレイピングしていると遅いので、キャッシュする
    let count = db.get(url)
    if (count === undefined) {
      count = await fetchPageRank(url, user)
    }
    db.set(url, count)

    items.push({
      title,
      url,
      count
    })
  }

  return items
}

async function recentItems(perPage = 10, page = 1, tag = null) {
  const uri = `https://qiita.com/api/v2/items?page=${page}&per_page=${perPage}${ tag ? `&query=tag%3A${tag}` : '' }`
  try {
    const body = await rp({
      uri,
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
      }
    })
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
