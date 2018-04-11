const {
  Transform
} = require('stream')
const handlebars = require('handlebars')
const template = handlebars.compile(`|[{{title}}]({{url}})|{{count}}|
`)

module.exports = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(template(chunk))
    callback()
  }
})
