// Ported from [poooi/plugin-quest/fetch.js](https://github.com/poooi/plugin-quest/blob/f3aec9b16ad337266ce7a27cd21edfb8d075a306/fetch.js)
// Thanks for [KagamiChan](https://github.com/KagamiChan)
// Licensed under [the MIT license](https://github.com/poooi/plugin-quest/blob/master/LICENSE).

import { Quest } from '../types'

const fs = require('fs-extra')
const path = require('path')
const { map, fromPairs } = require('lodash')
const generateReqstr = require('./reqstr')
const i18next = require('i18next')
const questData: Quest[] = require('../build/data.json')

const LOCALES = ['zh-CN', 'zh-TW', 'ja-JP', 'en-US']

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

const main = async () => {
  try {
    const content = questData

    await initI18n()

    await LOCALES.forEach(async (lng) => {
      const translate = i18next.getFixedT(lng, [
        'poi-plugin-quest-info',
        'resources',
      ])
      const reqstr = generateReqstr(translate, lng)
      const result = map(content, (quest: Quest) => {
        try {
          return [quest.game_id, reqstr(quest.requirements)]
        } catch (e) {
          return [quest.game_id, '']
        }
      })
      await fs.outputJSON(
        path.resolve(`./build/i18n/${lng}.json`),
        fromPairs(result),
        { spaces: 2 },
      )
    })
  } catch (e) {
    console.warn(e, e.stack)
  }
}

main()
