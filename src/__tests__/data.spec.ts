import { postQuestMap, translationResources } from '../data'

describe('data', () => {
  it('should translationResources correct', () => {
    expect(translationResources).toMatchSnapshot()
  })

  it('postQuestMap should always return array', () => {
    const invaildId = 9e9
    expect(postQuestMap[invaildId]).toEqual([])
  })
})
