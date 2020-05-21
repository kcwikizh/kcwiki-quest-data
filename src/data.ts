import keyBy from 'lodash/keyBy'

import type { Quest } from '../types'
import data from '../build/data.json'

export const UNKNOWN_QUEST: Quest = {
  game_id: -1,
  wiki_id: 'UNKNOWN',
  category: 1,
  type: 1,
  name: 'UNKNOWN',
  detail: 'UNKNOWN',
  reward_fuel: 0,
  reward_ammo: 0,
  reward_steel: 0,
  reward_bauxite: 0,
  reward_other: [],
  prerequisite: [],
  requirements: {
    category: 'and',
    list: [],
  },
}

export const questData = data as Quest[]
export const questDataMap = keyBy(questData, 'game_id')
const postQuestMap = questData.reduce(
  (acc: { [questId: number]: number[] }, cur) => {
    cur.prerequisite.forEach((pre) => {
      acc[pre]?.push(cur.game_id) ?? (acc[pre] = [cur.game_id])
    })
    return acc
  },
  {},
)

const postQuestMapProxy = new Proxy(postQuestMap, {
  get(target, p) {
    return Reflect.get(target, p) ?? []
  },
})

export { postQuestMapProxy as postQuestMap }

export { default as translationResources } from '../build/i18n'
