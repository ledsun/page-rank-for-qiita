const getUrlFromReference = require('./get-url-from-reference')

// ボットなどのページランクから除外したい、リンク元URL
const BOT_URLS = [
  '/hikarut/items/6138e8e406da17f5b67c',
  '/hikarut/items/1dd6e8e3f58f89d17706',
  '/hikarut/items/fc0310a6355c3b2d3700',
  '/takeharu/items/bb154a4bc198fb102ff3',
  '/ledsun/items/1f7572eacd6ce864e0db'
]

module.exports = function(references) {
  return references
    .filter((attribute) => {
      // 参照用のURLはリンクを強調するためにハッシュが付いている
      const referenceUrl = attribute.value()
      const withoutHash = referenceUrl.split('#')[0]

      return !BOT_URLS.includes(withoutHash)
    })
}
