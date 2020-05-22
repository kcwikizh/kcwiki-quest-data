import { postQuestMap, translationResources } from '../data'

describe('data', () => {
  it('should translationResources correct', () => {
    expect(translationResources).toMatchSnapshot()
  })

  it('postQuestMap should always return array', () => {
    const invalidId = 9e9
    expect(postQuestMap[invalidId]).toEqual([])
  })
})
