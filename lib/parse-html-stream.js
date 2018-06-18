const {
  Transform
} = require('stream')
const {
  parse
} = require('./html-parser')

const XPATH_TITLE = '//*[@id="main"]/article/div[1]/div/div[2]/div/div[1]/h1/text()'
const XPATH_TAGS = '//*[@id="main"]/article//div[@class="it-Tags"]//span/text()'
const XPATH_UPDATED_AT = '//*[@id="main"]/article/div[1]/div/div[2]/div/div[1]/div[1]/div/div[2]/span/time/@datetime'

module.exports = class extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    })
  }
  _transform(chunk, encoding, callback) {
    const {
      body
    } = chunk

    // 空文字はパースできない
    const parsedBody = body === '' ? null : parse(body)
    this.push(Object.assign(chunk, {
      parsedBody
    }))
    callback()
  }
}
