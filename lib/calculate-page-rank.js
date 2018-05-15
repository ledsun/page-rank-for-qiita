module.exports = function(count, content_length, updated_at) {
  if (count === 0) {
    return 0
  }

  // 極端に短い記事は、説明不足なことが多い
  if (content_length < 30000) {
    return 0
  }

  // 5年で50%になる想定で、線形に割り引く
  const yearDiff = (new Date() - new Date(updated_at)) / 1000 / 3600 / 24 / 365
  const yearRate = (10 - yearDiff) / 10

  // 参照数が0と1は10倍ぐらいの価値の差があるが、40と1は40倍の価値はない
  return Math.floor((count + 9) / content_length * 1000000)
}
