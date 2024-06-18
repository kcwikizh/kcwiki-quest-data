"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestHelper = void 0;
const data_1 = require("./data");
const data_2 = require("./data");
class MaybeQuest {
    constructor(id) {
        this.questId = id;
    }
    static just(id) {
        return new MaybeQuest(id);
    }
    static nothing() {
        return new MaybeQuest();
    }
    ensure(resolve, reject) {
        if (this.questId) {
            const quest = data_2.questDataMap[this.questId];
            if (quest) {
                resolve === null || resolve === void 0 ? void 0 : resolve(new QuestHelper(quest));
                return new QuestHelper(quest);
            }
        }
        reject === null || reject === void 0 ? void 0 : reject(new Error('Quest Not Fund'));
    }
    forceEnsure() {
        var _a;
        return (_a = this.ensure()) !== null && _a !== void 0 ? _a : new QuestHelper(data_1.getUnknownQuest(this.questId));
    }
}
const DEFAULT_LANGUAGE = 'ja-JP';
let defaultLanguage = DEFAULT_LANGUAGE;
class QuestHelper {
    constructor(q) {
        this.lng = defaultLanguage;
        this.quest = q;
    }
    static nothing() {
        return MaybeQuest.nothing().forceEnsure();
    }
    /**
     * Return all wrapped quest
     */
    static all() {
        return data_1.questData.map((q) => QuestHelper.of(q));
    }
    /**
     * Change default language will **not** change the instances already created.
     */
    static setDefaultLanguage(lang) {
        defaultLanguage = lang;
        return this;
    }
    static getDefaultLanguage() {
        return defaultLanguage;
    }
    /**
     * Reset default language
     */
    static reset() {
        defaultLanguage = DEFAULT_LANGUAGE;
        return this;
    }
    /**
     * the game id
     */
    get id() {
        return this.quest.game_id;
    }
    /**
     * Return wrapped quest data
     */
    unwrap() {
        return this.quest;
    }
    changeLanguage(lng) {
        this.lng = lng;
        return this;
    }
    translate(lng = this.lng, fallback = true) {
        var _a, _b, _c;
        const gameId = String(this.quest.game_id);
        const langT = (_a = data_1.kcanotifyTranslation[lng]) !== null && _a !== void 0 ? _a : {};
        if (gameId in langT) {
            const t = langT[gameId];
            return t;
        }
        if (!fallback) {
            return undefined;
        }
        // fallback to kcwiki translation
        const kcT = (_b = data_1.translationResources[lng]) !== null && _b !== void 0 ? _b : {};
        if (gameId in kcT) {
            return kcT[gameId];
        }
        const defaultLagT = (_c = data_1.kcanotifyTranslation[DEFAULT_LANGUAGE]) !== null && _c !== void 0 ? _c : {};
        if (gameId in defaultLagT) {
            return defaultLagT[gameId];
        }
        return undefined;
    }
    /**
     * Get all wrapped prerequisite quest
     */
    getPrerequisite() {
        return this.quest.prerequisite
            .map((q) => QuestHelper.of(q))
            .map((maybe) => maybe.ensure())
            .filter((i) => !!i);
    }
    /**
     * Get all wrapped post quest
     */
    getPostQuest() {
        var _a, _b;
        return ((_b = (_a = data_1.postQuestMap[this.quest.game_id]) === null || _a === void 0 ? void 0 : _a.map((q) => QuestHelper.of(q)).map((maybe) => maybe.ensure()).filter((i) => !!i)) !== null && _b !== void 0 ? _b : []);
    }
}
exports.QuestHelper = QuestHelper;
QuestHelper.of = (quest) => {
    if (typeof quest === 'number') {
        return MaybeQuest.just(quest);
    }
    return new QuestHelper(quest);
};
