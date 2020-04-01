import { loadAllJson, mapValuesDeep } from '../scripts/utils'

const data = loadAllJson()

describe.each(data)('Validating quest %p', (quest) => {
  it('not contain empty string', () => {
    mapValuesDeep(quest, (v: any) => expect(v).not.toBe(''))
  })
})

describe('Validating quest prerequisite', () => {
  const questSet = data.reduce((set, quest) => {
    set.add(quest.game_id)
    return set
  }, new Set<number>())

  for (const quest of data) {
    it(`${quest.game_id} ${quest.wiki_id} prerequisite exists`, () => {
      for (const prerequisite of quest.prerequisite) {
        expect(questSet.has(prerequisite)).toBe(true)
      }
    })
  }
})
