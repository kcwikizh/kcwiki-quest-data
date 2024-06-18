"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
const quests_en_json_1 = __importDefault(require("./quests-en.json"));
const quests_jp_json_1 = __importDefault(require("./quests-jp.json"));
const quests_scn_json_1 = __importDefault(require("./quests-scn.json"));
const quests_tcn_json_1 = __importDefault(require("./quests-tcn.json"));
exports.default = {
    'en-US': quests_en_json_1.default,
    'ja-JP': quests_jp_json_1.default,
    'zh-CN': quests_scn_json_1.default,
    'zh-TW': quests_tcn_json_1.default,
};
exports.version = '5.8.7.0';
