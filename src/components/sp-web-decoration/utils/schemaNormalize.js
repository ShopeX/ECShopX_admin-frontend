import { cloneValue } from '../definitions/schema.js'

export function normalizeBySchema(fields, settings = {}) {
  if (!fields) return cloneValue(settings || {})

  const source = settings && typeof settings === 'object' ? settings : {}
  const out = {}

  Object.entries(fields).forEach(([name, spec]) => {
    let value = source[name]
    if (value === undefined && Array.isArray(spec.aliases)) {
      for (const alias of spec.aliases) {
        if (source[alias] !== undefined) {
          value = source[alias]
          break
        }
      }
    }
    out[name] = value === undefined ? cloneValue(spec.default) : cloneValue(value)
  })

  return out
}

export default {
  normalizeBySchema
}
