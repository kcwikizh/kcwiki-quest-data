import { QuestHelper } from '../QuestHelper'
import { questDataMap, getUnknownQuest } from '../data'

describe('QuestHelper basic usages', () => {
  it('should get correct quest', () => {
    const questId = 101
    expect(QuestHelper.of(questId).ensure()?.unwrap()).toBe(
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
    expect(QuestHelper.nothing().unwrap()).toEqual(getUnknownQuest())
    expect(QuestHelper.of(nonExistId).forceEnsure().unwrap()).toEqual(
      getUnknownQuest(nonExistId),
    )
  })

  it('should has consistent behavior between ensure and forceEnsure', () => {
    const questId = 102
    expect(QuestHelper.of(questId).ensure()?.unwrap()).toBe(
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

  it('change quest should affect other instance', () => {
    const quest101 = QuestHelper.of(101).forceEnsure().unwrap()
    // @ts-expect-error
    QuestHelper.of(101).forceEnsure().unwrap().something = 1

    // @ts-expect-error
    expect(quest101.something).toBe(1)
    // @ts-expect-error
    expect(QuestHelper.of(101).forceEnsure().unwrap().something).toBe(1)
    // reset
    // @ts-expect-error
    quest101.something === undefined
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
    expect(QuestHelper.getDefaultLanguage()).toBe(lng1)
    const nothing1 = QuestHelper.nothing()

    expect(nothing1.lng).toEqual(lng1)

    const lng2 = 'ja-JP'
    QuestHelper.setDefaultLanguage(lng2)
    expect(QuestHelper.getDefaultLanguage()).toBe(lng2)
    const nothing2 = QuestHelper.nothing()

    expect(nothing1.lng).toBe(lng1)
    expect(nothing2.lng).toBe(lng2)

    nothing1.changeLanguage(lng2)
    expect(nothing1.lng).toBe(lng2)

    QuestHelper.reset()
    expect(QuestHelper.getDefaultLanguage()).toBe(defaultLang)
  })

  it('should translate work', () => {
    const nothing = QuestHelper.nothing()
    expect(nothing.translate()).toBe(undefined)

    const q = QuestHelper.of(101).forceEnsure()
    expect(q.translate('zh-CN')).toMatchInlineSnapshot(`"编组任意舰船2只"`)
    expect(q.translate('zh-TW')).toMatchInlineSnapshot(`"編組任意艦船2只"`)
    expect(q.translate('ja-JP')).toMatchInlineSnapshot(
      `"艦2隻による艦隊を編成"`,
    )
    expect(q.translate('en-US')).toMatchInlineSnapshot(
      `"Have 2 any ships in your fleet"`,
    )

    // Unknown language will fallback to the default language
    // @ts-expect-error
    expect(q.translate('ko-KR')).toBe(q.translate('ja-JP'))

    // Close fallback
    // @ts-expect-error
    expect(q.translate('UNKNOWN-LANG', false)).toBe(undefined)
  })

  it('translate fail return undefined', () => {
    const nothing = QuestHelper.nothing()
    expect(nothing.translate()).toBe(undefined)

    const unknowQuest = QuestHelper.of(999999).forceEnsure()
    expect(unknowQuest.translate('en-US')).toBe(undefined)
  })
})
