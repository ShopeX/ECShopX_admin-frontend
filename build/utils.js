function generateId(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    const charCode = key.charCodeAt(i)
    hash = (hash << 5) - hash + charCode
    hash = hash & hash
  }
  const id = Math.abs(hash).toString(36) + key.length.toString(36)
  return id
}

module.exports = {
  generateId
}