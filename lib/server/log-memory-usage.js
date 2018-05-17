module.exports = function(...messages) {
  const used = process.memoryUsage()
  const mems = []
  for (let key in used) {
    mems.push(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
  }
  console.log(new Date(), `${messages.length ? `${messages.join(' ')} ` : ''}${mems.join(', ')}`)
}
