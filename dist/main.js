"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestHelper = exports.translationResources = exports.questDataMap = exports.questData = void 0;
__exportStar(require("./types"), exports);
var data_1 = require("./src/data");
Object.defineProperty(exports, "questData", { enumerable: true, get: function () { return data_1.questData; } });
Object.defineProperty(exports, "questDataMap", { enumerable: true, get: function () { return data_1.questDataMap; } });
Object.defineProperty(exports, "translationResources", { enumerable: true, get: function () { return data_1.translationResources; } });
var QuestHelper_1 = require("./src/QuestHelper");
Object.defineProperty(exports, "QuestHelper", { enumerable: true, get: function () { return QuestHelper_1.QuestHelper; } });
