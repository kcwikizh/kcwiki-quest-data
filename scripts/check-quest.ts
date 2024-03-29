import fs from 'fs'
import path from 'path'
import { unzipSync } from 'zlib'
import { fetch } from './proxy-fetch'
import csv from 'csvtojson'
import { keyBy } from 'lodash'
import { loadAllJson } from './utils'
import { Quest } from '../types'

interface PoiQuest {
  questId: string
  title: string
  detail: string
  category: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
}

const URL = 'https://api.poi.moe/dump/quests.csv.gz'
const OUTPUT_PATH = path.resolve('build')
const OUTPUT_FILE = path.resolve(OUTPUT_PATH, 'poi-quests.json')

const fetchQuestReport = async () => {
  const questsGz = await fetch(URL)
  const questCsvBuffer = await unzipSync(await questsGz.arrayBuffer())
  const json = await csv().fromString(questCsvBuffer.toString())
  return json.filter((i) => i.questId) as PoiQuest[]
}

/**
 * @see https://zh.kcwiki.org/wiki/任务/期间限定任务
 */
const blockList = [
  // Time-limited quests
  '初夏の整理整頓', // 初夏の整理整頓！【2016/6/30～2016/7/15】
  '秋刀魚漁', // 秋刀鱼祭典限时任务
  '冬季特別任務', // 2016冬季特別任務【2016/12/25～2017/1/25】
  '節分特別出撃', // 2017年节分限定【2017/1/25～2017/2/28】
  '春の準備任務', // 2017年女儿节限定【2017/2/28～2017/3/17】
  '五周年任務', // 2018年 游戏五周年纪念任务【2018/4/23～2018/4/23】
  '主計科任務',
  '主計科拡張任務', // 2018年5月15日春活迷你任务【2018/5/15~2018/4/23】
  '節分任務',
  '節分特別任務',
  '節分拡張任務', // 节分限时任务
  'バレンタイン限定任務', // 2019年2月8日情人节限定任务【2019/2/8-2019/2/27】
  'GW期間限定', // 2019年4月22日六周年出击任务【2019/4/22-2019/6/25】
  '桃の節句任務',
  '桃の節句作戦', // 2020年3月3日桃花节限时任务
  '春の期間限定任務',
  '七周年任務',

  // 2017年冬季活动 偵察戦力緊急展開！「光」作戦【2017/02/12 ～ 2017/02/28】
  '「彩雲」輸送分解',
  '【丙】作戦「彩雲」調達＆輸送分解',
  '敵大規模泊地の後方兵站線を分断せよ！',

  // 2017年秋季活动 捷号決戦！邀撃、レイテ沖海戦(前篇)【2017/11/17～2017/12/11】
  '「捷一号作戦」兵站補給線を確保せよ！',
  '「西村艦隊」完全編成、出撃準備！',
]

const needAddQuest = (poiQuest: PoiQuest) => {
  // filter dirty data
  if (+poiQuest.questId < 100) {
    return false
  }
  if (blockList.some((str) => poiQuest.title.includes(str))) {
    return false
  }
  return true
}

const main = async () => {
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH)
  }

  const poiQuests = fs.existsSync(OUTPUT_FILE)
    ? // Read from cache
      (JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')) as PoiQuest[])
    : await fetchQuestReport()
  // Cache
  !fs.existsSync(OUTPUT_FILE) &&
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(poiQuests, undefined, 2))

  const iteratee = (quest: Quest) => `${quest.game_id} ${quest.name}`
  const questMap = {
    ...keyBy(loadAllJson('outdated'), iteratee),
    ...keyBy(loadAllJson('draft'), iteratee),
    ...keyBy(loadAllJson('data'), iteratee),
  }

  for (const poiQuest of poiQuests) {
    const questKey = `${poiQuest.questId} ${poiQuest.title}`
    if (!needAddQuest(poiQuest) || questMap[questKey]) {
      continue
    }

    // Output for github actions
    // @see https://stackoverflow.com/questions/59191913/get-output-of-a-specific-step-in-github-actions
    // Using '%0A' as line break escape, see https://github.com/actions/create-release/issues/25
    console.log(
      `::set-output name=quest${poiQuest.questId}::- ${poiQuest.questId} ${poiQuest.title}%0A`,
    )

    const newQuest = {
      game_id: +poiQuest.questId,
      category: +poiQuest.category,
      type: +poiQuest.type,
      name: poiQuest.title,
      release_date: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'Asia/Shanghai',
      }),
    }

    // Move existing quest to outdated folder
    const newQuestPath = path.resolve('draft', `${newQuest.game_id}.json`)
    if (fs.existsSync(newQuestPath)) {
      const existedQuest = JSON.parse(
        fs.readFileSync(newQuestPath, 'utf8'),
      ) as { name: string }
      fs.renameSync(
        newQuestPath,
        path.resolve(
          'outdated',
          `${newQuest.game_id}_${existedQuest.name}.json`,
        ),
      )
      console.log(
        `Move outdated quest ${newQuest.game_id} ${existedQuest.name}`,
      )
    }
    fs.writeFileSync(
      newQuestPath,
      JSON.stringify(newQuest, undefined, 2) + '\n',
    )
    console.log(`Add new quest ${newQuest.game_id} ${newQuest.name}`)
  }
}

main()
