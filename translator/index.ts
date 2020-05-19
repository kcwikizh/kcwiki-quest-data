// Ported from [poooi/plugin-quest/fetch.js](https://github.com/poooi/plugin-quest/blob/f3aec9b16ad337266ce7a27cd21edfb8d075a306/fetch.js)
// Thanks for [KagamiChan](https://github.com/KagamiChan)
// Licensed under [the MIT license](https://github.com/poooi/plugin-quest/blob/master/LICENSE).

import questData from '../build/data.json'
import type { Quest } from '../types'

const fs = require('fs-extra')
const path = require('path')
const { map, fromPairs } = require('lodash')
const generateReqstr = require('./reqstr')
const i18next = require('i18next')

const OUTPUT_PATH = path.resolve('build', 'i18n')
export const LOCALES = ['zh-CN', 'zh-TW', 'ja-JP', 'en-US'] as const

const initI18n = async () => {
  const res = await Promise.all(
    LOCALES.map(async (locale) => {
      const pluginData = await fs.readJSON(
        path.resolve(__dirname, `i18n/${locale}.json`),
      )
      const resources = require(`poi-plugin-translator/i18n/${locale}.json`)
      return [locale, { resources, 'poi-plugin-quest-info': pluginData }]
    }),
  )

  i18next.init({
    resources: fromPairs(res),
    // debug: true,
  })
}

/**
 * @example
 * import zh_CN from './i18n/zh-CN.json'
 * export const translation = {
 *   'zh-CN': zh_CN,
 * }
 */
const generateTranslation = (locales: readonly string[]) => {
  const importCode = locales
    .map(
      (locale) => `import ${locale.replace('-', '_')} from './${locale}.json'`,
    )
    .join('\n')

  const exportCode =
    'export const translation = {\n' +
    locales
      .map((locale) => `  '${locale}': ${locale.replace('-', '_')},`)
      .join('\n') +
    '\n}'
  return `${importCode}\n\n${exportCode}`
}

const main = async () => {
  await initI18n()

  await LOCALES.forEach(async (lng) => {
    const translate = i18next.getFixedT(lng, [
      'poi-plugin-quest-info',
      'resources',
    ])
    const reqstr = generateReqstr(translate, lng)
    const result = map(questData, (quest: Quest) => {
      try {
        return [quest.game_id, reqstr(quest.requirements)]
      } catch (e) {
        console.error('Error at parse ', quest.game_id)
        throw e
      }
    })
    await fs.outputJSON(
      path.resolve(OUTPUT_PATH, `${lng}.json`),
      fromPairs(result),
      { spaces: 2 },
    )

    fs.writeFileSync(
      path.resolve(OUTPUT_PATH, 'index.ts'),
      generateTranslation(LOCALES),
    )
  })
}

main()
