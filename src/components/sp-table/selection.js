export function getRowKey(row = {}, rowKey = 'id') {
  if (typeof rowKey === 'function') return rowKey(row)
  return row?.[rowKey]
}

export function normalizeKey(value) {
  return String(value ?? '').trim()
}

export function isSameRow(left = {}, right = {}, rowKey = 'id') {
  const leftKey = normalizeKey(getRowKey(left, rowKey))
  const rightKey = normalizeKey(getRowKey(right, rowKey))
  return Boolean(leftKey && rightKey && leftKey === rightKey)
}

export function toggleSingleSelection(currentRow, row, rowKey = 'id') {
  if (!row) return null
  return currentRow && isSameRow(currentRow, row, rowKey) ? null : row
}
