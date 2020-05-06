import fs from 'fs'
import path from 'path'
import { loadAllJson } from './utils'

const OUTPUT_PATH = path.resolve('build')

console.log('Loading data...')

const data = loadAllJson()

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'data.json'),
  JSON.stringify(data, undefined, 2),
)

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'data.min.json'),
  JSON.stringify(data),
)

const MD_PREFIX = '# Kantai Collection Quests\n\n'
fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'README.md'),
  MD_PREFIX +
    data.map((q) => `- ${q.game_id} ${q.wiki_id} ${q.name}`).join('\n'),
)

console.log('Build done!')
