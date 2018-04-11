const handlebars = require('handlebars')
const _ = require('lodash')
const crawle = require('./lib/crawle');

const template = handlebars.compile(`
|記事|ページランク|
|---|---|
{{#each this}}
|[{{title}}]({{url}})|{{count}}|
{{/each}}
`)

const TAG = process.argv[2]

;
(async () => {
  let ret = []
  // ITEM APIに指定するページの範囲
  // 1リクエストあたり100件の制限があるので、ページ数を変えて繰り返し実行します。
  for (page of _.range(1, 3)) {
    console.log('page', page);
    ret = ret.concat(await crawle(page, TAG))
  }
  console.log(template(ret.filter(r => r.count > 0)));
})()
