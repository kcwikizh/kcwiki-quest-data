import { fetch } from './proxy-fetch'
import path from 'path'
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs'

// See https://github.com/antest1/kcanotify-gamedata

const OUTPUT_PATH = path.resolve('build', 'kcanotify-gamedata')
const URL_PREFIX =
  'https://raw.githubusercontent.com/antest1/kcanotify-gamedata/master'
const VERSION_URL = `${URL_PREFIX}/DATA_VERSION`
const DATA_URL = `${URL_PREFIX}/files`
const LANGS = ['en', 'jp', 'scn', 'tcn'] as const

if (!existsSync(OUTPUT_PATH)) {
  mkdirSync(OUTPUT_PATH)
}

const getDataVersion = async () => {
  const resp = await fetch(VERSION_URL)
  if (!resp.ok) {
    throw new Error(`Fetch Error!\nurl: ${resp.url}\nstatus: ${resp.status}`)
  }
  return resp.text()
}

const checkVersion = async () => {
  const remoteVersion = await getDataVersion()
  const localVersionFile = path.resolve(OUTPUT_PATH, 'DATA_VERSION')
  const localVersion = existsSync(localVersionFile)
    ? readFileSync(localVersionFile).toString()
    : '-1'
  if (remoteVersion === localVersion) {
    console.log('The local version is up to date. Version: ', localVersion)
    return false
  }
  console.log('New Version Detected. Version:', remoteVersion)
  writeFileSync(`${OUTPUT_PATH}/DATA_VERSION`, remoteVersion)
  return true
}

const main = async () => {
  if (!(await checkVersion())) {
    return
  }

  LANGS.forEach(async (lang) => {
    const filename = `quests-${lang}.json`
    const fileURL = `${DATA_URL}/${filename}`

    console.log(`Download ${filename}...`)
    const resp = await fetch(fileURL)
    if (!resp.ok) {
      console.error(`Fetch Error!\nurl: ${resp.url}\nstatus: ${resp.status}`)
      return
    }
    const data = await resp.text()
    writeFileSync(`${OUTPUT_PATH}/${filename}`, data)
  })
}

main()
