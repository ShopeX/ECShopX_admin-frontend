import assert from 'node:assert/strict'
import test from 'node:test'
import { toggleSingleSelection, isSameRow } from './selection.mjs'

test('single selection replaces previous row', () => {
  const first = { id: 1, name: '测试' }
  const second = { id: 2, name: '620菜单' }

  assert.equal(toggleSingleSelection(first, second), second)
})

test('single selection toggles current row off', () => {
  const current = { id: '2', name: '620菜单' }
  const row = { id: 2, name: '620菜单' }

  assert.equal(toggleSingleSelection(current, row), null)
})

test('row comparison accepts custom row key function', () => {
  assert.equal(
    isSameRow({ code: 620 }, { code: '620' }, (row) => row.code),
    true
  )
})
