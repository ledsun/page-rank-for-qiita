const {
  Transform
} = require('stream')
const fs = require('fs')
const libxmljs = require('libxmljs')

const XPATH_TITLE = '//*[@id="main"]/article/div[1]/div/div[2]/div/div[1]/h1/text()'
const XPATH_TAGS = '//*[@id="main"]/article/div[1]/div/div[2]/div/div[1]/div[2]/a/span/text()'
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

    console.time('parse html')
    const doc = parse(body)
    const title = query(XPATH_TITLE, doc)
      .toString()
    const tags = query(XPATH_TAGS, doc)
      .map((b) => b.toString()
        .toLowerCase())
    const updated_at = query(XPATH_UPDATED_AT, doc)[0].value()
    console.timeEnd('parse html')

    this.push(Object.assign(chunk, {
      title,
      tags,
      updated_at
    }))
    callback()
  }
}

function parse(body) {
  return libxmljs.parseHtmlString(body)
}

function query(xpath, doc) {
  return doc.find(xpath)
}