import fs from 'fs'
import { loadAllJson } from './utils'

console.log('Loading data...')

const data = loadAllJson()

fs.writeFileSync('build/all.json', JSON.stringify(data, undefined, 2))
console.log('Build done!')
