const handlebars = require('handlebars')
const template = handlebars.compile(`|[{{title}}]({{url}})|{{count}}|
`)
const {
  Transform
} = require('stream');

module.exports = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    if (chunk.count > 0) {
      this.push(template(chunk))
    }
    callback()
  }
})
