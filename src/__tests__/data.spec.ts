import { postQuestMap, translationResources } from '../data'

describe('data', () => {
  it('should translationResources correct', () => {
    expect(translationResources).toMatchSnapshot()
  })

  it('postQuestMap maybe return undefined', () => {
    const invalidId = 9e9
    expect(postQuestMap[invalidId]).toEqual(undefined)
  })
})
