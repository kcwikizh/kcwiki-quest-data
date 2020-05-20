import type { Quest } from '../types'
import { translationResources, postQuestMap, UNKNOWN_QUEST } from './data'
import { questDataMap } from './data'

type Lang = keyof typeof translationResources

export class QuestHelper {
  quest: Quest
  lng: Lang = 'zh-CN'

  constructor(q: Quest) {
    this.quest = q
  }

  static of = (quest: number | Quest) => {
    if (typeof quest !== 'number') {
      return new QuestHelper(quest)
    }

    if (!questDataMap[quest]) {
      // unknown quest
      return new QuestHelper(UNKNOWN_QUEST)
    }
    return new QuestHelper(questDataMap[quest])
  }

  static query = (searchString: string) => {
    // TODO impl query
    return []
  }

  ensure() {
    if (this.quest && this.quest.game_id > 0) {
      return this
    }
    return undefined
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
