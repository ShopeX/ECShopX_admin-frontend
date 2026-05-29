const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function nanoid(length = 6) {
  let id = ''
  for (let index = 0; index < length; index += 1) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return id
}

export function generateSectionId(type) {
  return `${type}-${nanoid()}`
}

export function generateBlockId(type) {
  return `${type}-${nanoid()}`
}

export default {
  nanoid,
  generateSectionId,
  generateBlockId
}
