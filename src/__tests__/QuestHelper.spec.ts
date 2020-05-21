import { QuestHelper } from '../QuestHelper'
import { questDataMap, UNKNOWN_QUEST } from '../data'

describe('QuestHelper basic usages', () => {
  it('should get correct quest', () => {
    const questId = 101
    expect(QuestHelper.of(questId).ensure()?.unwrap()).toEqual(
      questDataMap[questId],
    )
  })

  it('should get QuestHelper directly', () => {
    const questId = 108
    const quest = questDataMap[questId]
    expect(QuestHelper.of(quest).unwrap()).toBe(quest)
  })

  it('ensure fail should get nothing', () => {
    const nonExistId = 0
    expect(QuestHelper.of(nonExistId).ensure()).toBe(undefined)
  })

  it('ensure success should call success callback', () => {
    const questId = 108
    const successCallback = jest.fn()
    const errCallback = jest.fn()
    QuestHelper.of(questId).ensure(successCallback, errCallback)

    expect(successCallback).toBeCalled()
    expect(successCallback).toBeCalledWith(expect.any(QuestHelper))
    expect(errCallback).not.toBeCalled()
  })

  it('ensure fail should call err callback', () => {
    const nonExistId = 0
    const successCallback = jest.fn()
    const errCallback = jest.fn()
    QuestHelper.of(nonExistId).ensure(successCallback, errCallback)

    expect(successCallback).not.toBeCalled()
    expect(errCallback).toBeCalled()
    expect(errCallback).toBeCalledWith(expect.any(Error))
  })

  it('forceEnsure fail should get UNKNOWN_QUEST', () => {
    const nonExistId = 9e9
    expect(QuestHelper.nothing().unwrap()).toEqual(UNKNOWN_QUEST)
    expect(QuestHelper.of(nonExistId).forceEnsure().unwrap()).toEqual(
      UNKNOWN_QUEST,
    )
  })

  it('should has consistent behavior between ensure and forceEnsure', () => {
    const questId = 102
    expect(QuestHelper.of(questId).ensure()?.unwrap()).toEqual(
      QuestHelper.of(questId).forceEnsure().unwrap(),
    )
  })

  it('prerequisite and postQuest', () => {
    const questIdPre = 101
    const questIdPost = 102
    const prerequisite = QuestHelper.of(questIdPost).ensure()!.getPrerequisite()
    expect(prerequisite).toHaveLength(1)
    expect(prerequisite[0].unwrap()).toBe(
      QuestHelper.of(questIdPre).ensure()!.unwrap(),
    )
    const postQuest = QuestHelper.of(questIdPre).ensure()!.getPostQuest()
    expect(postQuest).toHaveLength(1)
    expect(postQuest[0].unwrap()).toBe(
      QuestHelper.of(questIdPost).ensure()!.unwrap(),
    )
  })

  it('prerequisite and postQuest fail', () => {
    const questIdInvalid = 1e9
    const prerequisite = QuestHelper.of(questIdInvalid)
      .forceEnsure()
      .getPrerequisite()
    expect(prerequisite).toEqual([])

    const postQuest = QuestHelper.of(questIdInvalid)
      .forceEnsure()
      .getPostQuest()
    expect(postQuest).toEqual([])
  })
})

describe('QuestHelper with language', () => {
  beforeAll(() => {
    QuestHelper.reset()
  })

  it('should change language work', () => {
    const defaultLang = QuestHelper.getDefaultLanguage()
    const lng1 = 'en-US'
    QuestHelper.setDefaultLanguage(lng1)
    expect(QuestHelper.getDefaultLanguage()).toEqual(lng1)
    const nothing1 = QuestHelper.nothing()

    expect(nothing1.lng).toEqual(lng1)

    const lng2 = 'ja-JP'
    QuestHelper.setDefaultLanguage(lng2)
    expect(QuestHelper.getDefaultLanguage()).toEqual(lng2)
    const nothing2 = QuestHelper.nothing()

    expect(nothing1.lng).toEqual(lng1)
    expect(nothing2.lng).toEqual(lng2)

    nothing1.changeLanguage(lng2)
    expect(nothing1.lng).toEqual(lng2)

    QuestHelper.reset()
    expect(QuestHelper.getDefaultLanguage()).toEqual(defaultLang)
  })

  it('should translate work', () => {
    const nothing = QuestHelper.nothing()
    expect(nothing.translate()).toEqual(undefined)

    const q = QuestHelper.of(101).forceEnsure()
    const translates = ([
      'zh-CN',
      'zh-TW',
      'ja-JP',
      'en-US',
    ] as const).map((l) => q.translate(l))

    translates.forEach((t) => {
      expect(t).toBeTruthy()
      expect(t!.length).toBeGreaterThan(0)
    })
  })
})
