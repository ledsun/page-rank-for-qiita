const queryXPath = require('./query-xpath')
const rejectBot = require('./reject-bot')
const referFromOtherUser = require('./refer-from-other-user')
const libxmljs = require('libxmljs')

const XPATH_REFERENCE = '//*[@id="main"]//li[@class="references_reference js-reference"]//a/@href'
// Qittaでは、被参照記事は5件以上の時に、異なるクラスを指定して初期非表示にしています。
const XPATH_OLD_REFERENCE = '//*[@id="main"]//li[@class="references_reference js-reference js-oldReference"]//a/@href'

// 長いコメントを評価対象から除外するために、記事本文を取得
const XPATH_ARTICLE = '//*[@id="main"]/article/div[1]/div/div[2]/div'

module.exports = function(body, user) {
  const doc = parse(body)
  const referenceList = query(XPATH_REFERENCE, doc)
  const oldReferenceList = query(XPATH_OLD_REFERENCE, doc)
  const article = query(XPATH_ARTICLE, doc)

  const count = rejectBot(referFromOtherUser(referenceList.concat(oldReferenceList), user))
    .length
  const articleLength = article.toString()
    .length

  return {
    count,
    articleLength
  }
}

function parse(body) {
  return libxmljs.parseHtmlString(body)
}

function query(xpath, doc) {
  return doc.find(xpath)
}
