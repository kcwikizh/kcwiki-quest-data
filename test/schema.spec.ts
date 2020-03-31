import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'
import schemaDraft06 from 'ajv/lib/refs/json-schema-draft-06.json'

import schema from '../build/quest-schema.json'

describe('Validating schema', () => {
  const ajv = new Ajv()
  ajv.addMetaSchema(schemaDraft06)
  const validate = ajv.compile(schema)

  const folder = 'data'
  const files = fs.readdirSync(folder)

  for (const filename of files) {
    it(`${filename} match schema`, () => {
      const file = fs.readFileSync(path.resolve('data', filename), 'utf8')
      const json = JSON.parse(file)
      const valid = validate(json)
      expect(valid).toEqual(true)
    })
  }
})
