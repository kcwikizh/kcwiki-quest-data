import fs from 'fs'

import schema from '../build/schema.json'
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
})

questSchema.$ref = '#/definitions/Quest'

fs.writeFileSync(
  'build/quest.json',
  JSON.stringify(questSchema, undefined, 2),
  'utf8'
)
