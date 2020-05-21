import type { Quest } from '../types'
import { translationResources, postQuestMap, UNKNOWN_QUEST } from './data'
import { questDataMap } from './data'

type Lang = keyof typeof translationResources

class MaybeQuest {
  quest: Quest | undefined

  constructor(q: Quest) {
    this.quest = q
  }

  ensure() {
    if (this.quest && this.quest.game_id > 0) {
      return new QuestHelper(this.quest)
    }
    return undefined
  }

  forceEnsure() {
    if (this.quest && this.quest.game_id > 0) {
      return new QuestHelper(this.quest)
    }
    return new QuestHelper(UNKNOWN_QUEST)
  }
}

export class QuestHelper {
  quest: Quest
  lng: Lang = 'zh-CN'

  constructor(q: Quest) {
    this.quest = q
  }

  static of = <T extends number | Quest>(
    quest: T,
  ): T extends number ? MaybeQuest : QuestHelper => {
    if (typeof quest === 'number') {
      return new MaybeQuest(questDataMap[quest]) as any
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
