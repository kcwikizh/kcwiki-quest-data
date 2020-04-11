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

console.log('Build done!')
