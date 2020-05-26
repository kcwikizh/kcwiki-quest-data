import keyBy from 'lodash/keyBy'
import type { Quest } from '../types'
import data from '../build/data.json'
import postQuest from '../build/post-quest.json'

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
export const postQuestMap = postQuest as { [key: number]: number[] }
export { default as translationResources } from '../build/i18n'
