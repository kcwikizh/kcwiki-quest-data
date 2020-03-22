import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'

import schema from '../build/quest-schema.json'

const ajv = new Ajv()
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

const validate = ajv.compile(schema)

console.log('Loading data...')
const data = fs
  .readdirSync('data')
  .map(filename => path.resolve('data', filename))
  // .slice(0, 400)
  .map(file => {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (e) {
      console.error(file)
      console.error(e)
      return undefined
    }
  })
  .filter(i => i)

console.log('Validating...')

for (const quest of data) {
  const valid = validate(quest)
  if (!valid) {
    console.error(`${quest.game_id} ${quest.wiki_id} valid fail`)
    // console.error(validate.errors)
  }
}

console.log('Validating done!')

fs.writeFileSync('build/all.json', JSON.stringify(data, undefined, 2))
console.log('Build done!')
