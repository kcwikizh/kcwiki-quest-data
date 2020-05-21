import type { Quest } from '../types'
import { translationResources, postQuestMap, UNKNOWN_QUEST } from './data'
import { questDataMap } from './data'

class MaybeQuest {
  private questId: number | undefined

  constructor(id?: number) {
    this.questId = id
  }

  static just(id: number) {
    return new MaybeQuest(id)
  }

  static nothing() {
    return new MaybeQuest()
  }

  ensure(resolve?: (quest: QuestHelper) => any, reject?: (err: Error) => any) {
    if (this.questId) {
      const quest = questDataMap[this.questId]
      if (quest) {
        resolve?.(new QuestHelper(quest))
        return new QuestHelper(quest)
      }
    }
    reject?.(new Error('Quest Not Fund'))
  }

  forceEnsure() {
    return this.ensure() ?? new QuestHelper(UNKNOWN_QUEST)
    }
  }

type Lang = keyof typeof translationResources
let defaultLanguage: Lang = 'zh-CN'

export class QuestHelper {
  private quest: Quest
  lng: Lang = defaultLanguage

  constructor(q: Quest) {
    this.quest = q
  }

  static of = <T extends number | Quest>(
    quest: T,
  ): T extends number ? MaybeQuest : QuestHelper => {
    if (typeof quest === 'number') {
      return MaybeQuest.just(quest) as any
    }
    return new QuestHelper(quest as Quest) as any
  }

  static query = (searchString: string) => {
    // TODO impl query
    return []
  }

  unwrap() {
    return this.quest
  }

  changeLanguage(lng: Lang) {
    this.lng = lng
    return this
  }

  translate(lng = this.lng): string | undefined {
    return (translationResources[lng] as { [key: string]: string })[
      this.quest.game_id
    ]
  }

  getPrerequisite() {
    return this.quest.prerequisite.map((q) => QuestHelper.of(q))
  }

  getPostQuest() {
    return postQuestMap[this.quest.game_id].map((q) => QuestHelper.of(q))
  }
}
