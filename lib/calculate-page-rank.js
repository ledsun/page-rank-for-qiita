module.exports = function(count, content_length) {
  if (count === 0) {
    return 0
  }

  // 参照数が0と1は100倍ぐらいの価値の差があるが、40と1は40倍の価値はない
  return Number(((count + 100) / content_length * 100)
    .toFixed(2))
}
