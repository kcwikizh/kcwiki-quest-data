import fs from 'fs'
import path from 'path'

console.log('Loading data...')

const data = fs
  .readdirSync('data')
  .map((filename) => path.resolve('data', filename))
  .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))

fs.writeFileSync('build/all.json', JSON.stringify(data, undefined, 2))
console.log('Build done!')
