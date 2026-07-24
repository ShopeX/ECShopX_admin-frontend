import { customAlphabet } from 'nanoid'

const generate = customAlphabet('1234567890abcdef', 10)

export default function generateComponentUuid() {
  return generate()
}
