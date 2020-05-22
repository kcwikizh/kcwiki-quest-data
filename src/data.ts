import keyBy from 'lodash/keyBy'

import type { Quest } from '../types'
import data from '../build/data.json'

export const getUnknownQuest = (id = -1): Quest => ({
  game_id: id,
  wiki_id: 'UNKNOWN_ID',
  category: 1,
  type: 1,
  name: 'UNKNOWN_QUEST',
  detail: 'UNKNOWN_DETAIL',
  reward_fuel: -1,
  reward_ammo: -1,
  reward_steel: -1,
  reward_bauxite: -1,
  reward_other: [],
  prerequisite: [],
  requirements: {
    category: 'and',
    list: [],
  },
})

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
