const {
  parse,
  query
} = require('../../html-parser')
const rejectBot = require('./reject-bot')
const referFromOtherUser = require('./refer-from-other-user')

const XPATH_REFERENCE = '//*[@id="main"]//li[@class="references_reference js-reference"]//a/@href'
// Qittaでは、被参照記事は5件以上の時に、異なるクラスを指定して初期非表示にしています。
const XPATH_OLD_REFERENCE = '//*[@id="main"]//li[@class="references_reference js-reference js-oldReference"]//a/@href'

// 長いコメントを評価対象から除外するために、記事本文を取得
const XPATH_ARTICLE = '//*[@id="main"]/article//section[@class="it-MdContent"]'

module.exports = function(body, user) {
  // 空文字はパースできない
  if (body === '') {
    return {
      conut: 0,
      articleLength: 0
    }
  }

  try {
    const doc = parse(body)
    const referenceList = query(XPATH_REFERENCE, doc)
    const oldReferenceList = query(XPATH_OLD_REFERENCE, doc)
    const article = query(XPATH_ARTICLE, doc)

    const count = rejectBot(referFromOtherUser(referenceList.concat(oldReferenceList)
        .map((a) => a.value()), user))
      .length
    const articleLength = article.length ? article[0].text()
      .length : 0

    return {
      count,
      articleLength
    }
  } catch (e) {
    console.error(new Date(), e, body)
    return {
      conut: 0,
      articleLength: 0
    }
  }
}
