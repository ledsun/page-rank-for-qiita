// Raito降順の上位100件までを返す。
module.exports = function(knownItems) {
  return knownItems.sort((a, b) => {
      // カウント、更新日降順
      return (a.ratio < b.ratio) ? 1 :
        (a.ratio > b.ratio) ? -1 :
        (a.updated_at < b.updated_at) ? 1 :
        (a.updated_at > b.updated_at) ? -1 :
        0
    })
    .slice(0, 100)
}
