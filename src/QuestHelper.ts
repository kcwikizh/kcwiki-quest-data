import type { Quest } from '../types'
import {
  translationResources,
  postQuestMap,
  getUnknownQuest,
  questData,
} from './data'
import { query } from './query'
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

  ensure(
    resolve?: (questContainer: QuestHelper) => any,
    reject?: (err: Error) => any,
  ) {
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
    return this.ensure() ?? new QuestHelper(getUnknownQuest(this.questId))
  }
}

export type QuestHelperLang = keyof typeof translationResources
const DEFAULT_LANGUAGE = 'ja-JP'
let defaultLanguage: QuestHelperLang = DEFAULT_LANGUAGE

export class QuestHelper {
  private readonly quest: Quest
  lng: QuestHelperLang = defaultLanguage

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

  static nothing() {
    return MaybeQuest.nothing().forceEnsure()
  }

  /**
   * Return all wrapped quest
   */
  static all() {
    return questData.map((q) => QuestHelper.of(q))
  }

  /**
   * Change default language will **not** change the instances already created.
   */
  static setDefaultLanguage(lang: QuestHelperLang) {
    defaultLanguage = lang
    return this
  }

  static getDefaultLanguage() {
    return defaultLanguage
  }

  /**
   * Reset default language
   */
  static reset() {
    defaultLanguage = DEFAULT_LANGUAGE
    return this
  }

  static query = (searchString: string) => {
    return (
      query(searchString)
        .map((q) => QuestHelper.of(q))
        .map((maybe) => maybe.ensure())
        .filter((i): i is QuestHelper => !!i) ?? []
    )
  }

  /**
   * the game id
   */
  get id() {
    return this.quest.game_id
  }

  /**
   * Return wrapped quest data
   */
  unwrap() {
    return this.quest
  }

  changeLanguage(lng: QuestHelperLang) {
    this.lng = lng
    return this
  }

  translate(lng = this.lng, fallback = true): string | undefined {
    const t = (translationResources[lng] as { [key: string]: string })?.[
      this.quest.game_id
    ]
    if (t !== undefined || !fallback) {
      return t
    }

    return (translationResources[DEFAULT_LANGUAGE] as {
      [key: string]: string
    })?.[this.quest.game_id]
  }

  /**
   * Get all wrapped prerequisite quest
   */
  getPrerequisite() {
    return this.quest.prerequisite
      .map((q) => QuestHelper.of(q))
      .map((maybe) => maybe.ensure())
      .filter((i): i is QuestHelper => !!i)
  }

  /**
   * Get all wrapped post quest
   */
  getPostQuest() {
    return (
      postQuestMap[this.quest.game_id]
        ?.map((q) => QuestHelper.of(q))
        .map((maybe) => maybe.ensure())
        .filter((i): i is QuestHelper => !!i) ?? []
    )
  }
}
