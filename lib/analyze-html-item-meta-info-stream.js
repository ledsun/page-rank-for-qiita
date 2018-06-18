const {
  Transform
} = require('stream')
const {
  query
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
      parsedBody
    } = chunk

    const title = query(XPATH_TITLE, parsedBody)
      .toString()
    const tags = query(XPATH_TAGS, parsedBody)
      .map((b) => b.toString()
        .toLowerCase())
    const updated_at = query(XPATH_UPDATED_AT, parsedBody)[0].value()

    this.push(Object.assign(chunk, {
      title,
      tags,
      updated_at
    }))
    callback()
  }
}
