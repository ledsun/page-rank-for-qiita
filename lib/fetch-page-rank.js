const rp = require('request-promise')
const libxmljs = require('libxmljs')

module.exports = async function countReferences(url, user) {
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
