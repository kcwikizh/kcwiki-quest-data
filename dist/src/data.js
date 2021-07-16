"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translationResources = exports.kcanotifyTranslation = exports.postQuestMap = exports.questDataMap = exports.questData = exports.getUnknownQuest = void 0;
const keyBy_1 = __importDefault(require("lodash/keyBy"));
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const difference_1 = __importDefault(require("lodash/difference"));
const data_json_1 = __importDefault(require("../build/data.json"));
const post_quest_json_1 = __importDefault(require("../build/post-quest.json"));
const kcanotify_gamedata_1 = __importDefault(require("../build/kcanotify-gamedata"));
const getUnknownQuest = (id = -1, wikiId = 'UNKNOWN_ID', name = 'UNKNOWN_QUEST', detail = 'UNKNOWN_DETAIL') => ({
    game_id: id,
    wiki_id: wikiId,
    category: 0,
    type: 1,
    name,
    detail,
    reward_fuel: -1,
    reward_ammo: -1,
    reward_steel: -1,
    reward_bauxite: -1,
    reward_other: [],
    prerequisite: [],
    requirements: {
        category: 'and',
        list: [],
    },
});
exports.getUnknownQuest = getUnknownQuest;
exports.questData = data_json_1.default;
const kcwikiQuestDataMap = keyBy_1.default(exports.questData, 'game_id');
const kcanotifyJp = kcanotify_gamedata_1.default['ja-JP'];
const kcaKeys = difference_1.default(Object.keys(kcanotifyJp), Object.keys(kcwikiQuestDataMap));
const kcaQuestDataMap = keyBy_1.default(kcaKeys.map((key) => {
    const { code, name, desc } = kcanotifyJp[key];
    return exports.getUnknownQuest(+key, code, name, desc);
}), 'game_id');
exports.questDataMap = {
    ...kcwikiQuestDataMap,
    ...kcaQuestDataMap,
};
exports.postQuestMap = post_quest_json_1.default;
exports.kcanotifyTranslation = mapValues_1.default(kcanotify_gamedata_1.default, (data) => mapValues_1.default(data, (item) => item.desc));
var i18n_1 = require("../build/i18n");
Object.defineProperty(exports, "translationResources", { enumerable: true, get: function () { return __importDefault(i18n_1).default; } });
