const getReferences = require('./get-references')
const rejectBot = require('./reject-bot')
const referFromOtherUser = require('./refer-from-other-user')

const XPATH = '//*[@id="main"]/x:article/x:div[2]/x:div[2]/x:div[1]/x:div[2]/x:div/x:ul/x:li[@class="references_reference js-reference"]'

module.exports = function(body, user) {
  const referenceList = getReferences(body, XPATH)
  return rejectBot(referFromOtherUser(referenceList, user))
    .length
}
