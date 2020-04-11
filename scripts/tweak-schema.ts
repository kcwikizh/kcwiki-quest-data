import fs from 'fs'
import path from 'path'
import schema from '../build/schema-quicktype.json'
import { mapKeysDeep } from './utils'

const schemaSource = schema

// see [[json] Markdown in hovers (descriptions from schema)](https://github.com/microsoft/vscode/issues/34498)
const questSchema = mapKeysDeep(schemaSource, (value: any, key: string) => {
  // map descriptions to markdownDescription
  if (key === 'description') {
    return 'markdownDescription'
  }
  // map markdownEnumDescriptions
  if (key === 'enumDescriptions') {
    return 'markdownEnumDescriptions'
  }
  return key
}) as typeof schemaSource
;(questSchema as any).$ref = '#/definitions/Quest'

// disabled additional properties for every definitions
Object.values(questSchema.definitions).forEach(
  (obj: object) => ((obj as any).additionalProperties = false),
)

const OUTPUT_PATH = path.resolve('build')

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'schema-quest.json'),
  JSON.stringify(questSchema, undefined, 2),
  'utf8',
)
