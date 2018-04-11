const libxmljs = require('libxmljs')
const rp = require('request-promise')
const sleep = require('sleep-promise')
const handlebars = require('handlebars')
const _ = require('lodash')

const template = handlebars.compile(`
|記事|ページランク|
|---|---|
{{#each this}}
|[{{title}}]({{url}})|{{count}}|
{{/each}}
`)

;
(async () => {
  let ret = []
  // ITEM APIに指定するページの範囲
  // 1リクエストあたり100件の制限があるので、ページ数を変えて繰り返し実行します。
  for (page of _.range(1, 3)) {
    console.log('page', page);
    ret = ret.concat(await crawle(page))
  }

  console.log(template(ret.filter(r => r.count > 0)));
})()

async function crawle(page) {
  const urls = await recentItems(100, page)
  const items = []
  for (const {
      title,
      url,
      user
    } of urls) {
    const count = await countReferences(url, user)
    items.push({
      title,
      url,
      count
    })
  }

  return items
}

async function recentItems(perPage = 10, page = 1) {
  const body = await rp({
    uri: `https://qiita.com/api/v2/items?page=${page}&per_page=${perPage}`,
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
}

async function countReferences(url, user) {
  try {
    const body = await rp(url)
    const xmlDoc = libxmljs.parseHtmlString(body)
    const referenceList = xmlDoc.get('//*[@id="main"]/article/div[2]/div[2]/div[2]/div/ul[1]')
    return referenceList ? rejectBot(referenceFromOtherUser(filterLinkedFrom(referenceList.childNodes()), user))
      .length : 0
  } catch (e) {
    console.log(url, user);
    console.error(e);
  }
}

function filterLinkedFrom(references) {
  return references
    .filter((node) => node.attr('class')
      .value() === 'references_reference js-reference')
}

function rejectBot(references) {
  // ボットなどのページランクから除外したい、リンク元URL
  const botUrls = [
    '/hikarut/items/6138e8e406da17f5b67c',
    '/hikarut/items/1dd6e8e3f58f89d17706',
    '/hikarut/items/fc0310a6355c3b2d3700',
    '/takeharu/items/bb154a4bc198fb102ff3',
    '/ledsun/items/1f7572eacd6ce864e0db'
  ]
  return references
    .filter((node) => {
      const referenceUrl = getReferenceUrl(node)
      const withoutHash = referenceUrl.split('#')[0]

      return !botUrls.includes(withoutHash)
    })
}

function referenceFromOtherUser(references, user) {
  return references
    .filter((node) => {
      const referenceUrl = getReferenceUrl(node)
      const match = /^\/([\d\w@-]+)\//.exec(referenceUrl)
      return match[1] !== user
    })
}

function getReferenceUrl(node) {
  const aTag = node.childNodes()[1]
  return aTag.attr('href')
    .value()
}
