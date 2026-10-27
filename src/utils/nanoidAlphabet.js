// PC 装修页组件 uuid 生成；不直接 import nanoid，避免 webpack 对 ESM 命名导出解析失败
const ALPHABET = '1234567890abcdef'
const DEFAULT_SIZE = 10

function generateId(size = DEFAULT_SIZE) {
  let id = ''
  let i = size | 0
  while (i--) {
    id += ALPHABET[(Math.random() * ALPHABET.length) | 0]
  }
  return id
}

export default function generateComponentUuid() {
  return generateId()
}
