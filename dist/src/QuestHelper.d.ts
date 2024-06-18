import type { Quest } from '../types';
import { translationResources, kcanotifyTranslation } from './data';
declare class MaybeQuest {
    private questId;
    constructor(id?: number);
    static just(id: number): MaybeQuest;
    static nothing(): MaybeQuest;
    ensure(resolve?: (questContainer: QuestHelper) => any, reject?: (err: Error) => any): QuestHelper | undefined;
    forceEnsure(): QuestHelper;
}
export declare type QuestHelperLang = keyof typeof kcanotifyTranslation & keyof typeof translationResources;
export declare class QuestHelper {
    private readonly quest;
    lng: QuestHelperLang;
    constructor(q: Quest);
    static of: <T extends number | Quest>(quest: T) => T extends number ? MaybeQuest : QuestHelper;
    static nothing(): QuestHelper;
    /**
     * Return all wrapped quest
     */
    static all(): QuestHelper[];
    /**
     * Change default language will **not** change the instances already created.
     */
    static setDefaultLanguage(lang: QuestHelperLang): typeof QuestHelper;
    static getDefaultLanguage(): "ja-JP" | "en-US" | "zh-CN" | "zh-TW";
    /**
     * Reset default language
     */
    static reset(): typeof QuestHelper;
    /**
     * the game id
     */
    get id(): number;
    /**
     * Return wrapped quest data
     */
    unwrap(): Quest;
    changeLanguage(lng: QuestHelperLang): this;
    translate(lng?: "ja-JP" | "en-US" | "zh-CN" | "zh-TW", fallback?: boolean): string | undefined;
    /**
     * Get all wrapped prerequisite quest
     */
    getPrerequisite(): QuestHelper[];
    /**
     * Get all wrapped post quest
     */
    getPostQuest(): QuestHelper[];
}
export {};
