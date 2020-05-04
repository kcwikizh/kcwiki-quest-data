import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'
import schemaDraft06 from 'ajv/lib/refs/json-schema-draft-06.json'
import schema from '../build/schema-quest.json'
import { loadAllJson } from '../scripts/utils'
import { Quest } from '../types'

describe('Validating format', () => {
  const DATA_DIR = 'data'
  const files = fs.readdirSync(DATA_DIR)

  it.each(files)('%s match json object format', (filename) => {
    const file = fs.readFileSync(path.resolve(DATA_DIR, filename), 'utf8')
    try {
      const json = JSON.parse(file)
      expect(typeof json).toBe('object')
    } catch (error) {
      fail('json parse error: ' + error)
    }
  })

  it.each(files)('%s match game_id', (filename) => {
    const file = fs.readFileSync(path.resolve(DATA_DIR, filename), 'utf8')
    const json = JSON.parse(file) as Quest
    expect(json.game_id).toBe(+filename.split('.')[0])
  })
})

describe('Validating schema', () => {
  const ajv = new Ajv()
  ajv.addMetaSchema(schemaDraft06)
  const validate = ajv.compile(schema)

  const data = loadAllJson()
  it.each(data)('%p match schema', (quest) => {
    const valid = validate(quest)
    expect(valid).toEqual(true)
  })
})
