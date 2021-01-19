import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import difference from 'lodash/difference'
import type { Quest } from '../types'
import kcwikiData from '../build/data.json'
import postQuest from '../build/post-quest.json'
import kcanotifyData from '../build/kcanotify-gamedata'

export const getUnknownQuest = (
  id = -1,
  wikiId = 'UNKNOWN_ID',
  name = 'UNKNOWN_QUEST',
  detail = 'UNKNOWN_DETAIL',
): Quest => ({
  game_id: id,
  wiki_id: wikiId,
  category: 0,
  type: 1,
  name,
  detail,
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

export const questData = kcwikiData as Quest[]
const kcwikiQuestDataMap = keyBy(questData, 'game_id')
const kcanotifyJp = kcanotifyData['ja-JP']
const kcaKeys = difference(
  Object.keys(kcanotifyJp),
  Object.keys(kcwikiQuestDataMap),
)
const kcaQuestDataMap = keyBy(
  kcaKeys.map((key) => {
    const { code, name, desc } = kcanotifyJp[key as keyof typeof kcanotifyJp]
    return getUnknownQuest(+key, code, name, desc)
  }),
  'game_id',
)

export const questDataMap = {
  ...kcwikiQuestDataMap,
  ...kcaQuestDataMap,
}

export const postQuestMap = postQuest as { [key: number]: number[] }
export const kcanotifyTranslation = mapValues(kcanotifyData, (data) =>
  mapValues(data, (item) => item.desc),
)

export { default as translationResources } from '../build/i18n'
