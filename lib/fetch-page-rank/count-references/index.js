const queryXPath = require('./query-xpath')
const rejectBot = require('./reject-bot')
const referFromOtherUser = require('./refer-from-other-user')

const XPATH_REFERENCE = '//*[@id="main"]/x:article/x:div[2]/x:div[2]/x:div[1]/x:div[2]/x:div/x:ul/x:li[@class="references_reference js-reference"]'
// Qittaでは、被参照記事は5件以上の時に、異なるクラスを指定して初期非表示にしています。
const XPATH_OLD_REFERENCE = '//*[@id="main"]/x:article/x:div[2]/x:div[2]/x:div[1]/x:div[2]/x:div/x:ul/x:li[@class="references_reference js-reference js-oldReference"]'

module.exports = function(body, user) {
  const referenceList = queryXPath(body, XPATH_REFERENCE)
  const oldReferenceList = queryXPath(body, XPATH_OLD_REFERENCE)
  return rejectBot(referFromOtherUser(referenceList.concat(oldReferenceList), user))
    .length
}
