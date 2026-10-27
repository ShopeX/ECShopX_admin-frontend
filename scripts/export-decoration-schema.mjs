import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const tempDir = path.join(tmpdir(), 'ecx-decoration-contract')
const tempSchemaPath = path.join(tempDir, `schema-${process.pid}.mjs`)
mkdirSync(tempDir, { recursive: true })
copyFileSync(
  path.resolve(root, 'src/components/sp-web-decoration/definitions/schema.js'),
  tempSchemaPath
)
const schemaUrl = pathToFileURL(tempSchemaPath).href
const { createDecorationSchema } = await import(schemaUrl)
rmSync(tempSchemaPath, { force: true })

const outputPath = process.argv[2]
if (!outputPath) {
  throw new Error('Usage: node scripts/export-decoration-schema.mjs <output-path>')
}

const resolvedOutput = path.resolve(root, outputPath)
mkdirSync(path.dirname(resolvedOutput), { recursive: true })
writeFileSync(resolvedOutput, `${JSON.stringify(createDecorationSchema(), null, 2)}\n`, 'utf8')
console.log(`Exported decoration schema to ${resolvedOutput}`)
