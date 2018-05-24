const {
  Transform
} = require('stream')
const fs = require('fs')
const queryXPath = require('../lib/analyze-html-stream/analyze-html/query-xpath')

const XPATH_TITLE = '//*[@id="main"]/x:article/x:div[1]/x:div/x:div[2]/x:div/x:div[1]/x:h1/text()'
const XPATH_TAGS = '//*[@id="main"]/x:article/x:div[1]/x:div/x:div[2]/x:div/x:div[1]/x:div[2]/x:a/x:span/text()'
const XPATH_UPDATED_AT = '//*[@id="main"]/x:article/x:div[1]/x:div/x:div[2]/x:div/x:div[1]/x:div[1]/x:div/x:div[2]/x:span/x:time/@datetime'

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
    const title = queryXPath(body, XPATH_TITLE)
      .toString()
    const tags = queryXPath(body, XPATH_TAGS)
      .map((b) => b.toString()
        .toLowerCase())
    const updated_at = queryXPath(body, XPATH_UPDATED_AT)[0].value
    console.timeEnd('parse html')

    this.push(Object.assign(chunk, {
      title,
      tags,
      updated_at
    }))
    callback()
  }
}
