module.exports = function(count, content_length) {
  if (count === 0) {
    return 0
  }

  // 極端に短い記事は、説明不足なことが多い
  if (content_length < 30000) {
    return 0
  }

  // 参照数が0と1は10倍ぐらいの価値の差があるが、40と1は40倍の価値はない
  return Number(((count + 9) / content_length * 10000)
    .toFixed(2))
}
