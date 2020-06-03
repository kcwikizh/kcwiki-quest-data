import fs from 'fs'
import path from 'path'
import { loadAllJson } from './utils'

const OUTPUT_PATH = path.resolve('build')

if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH)
}

console.log('Loading data...')

const data = loadAllJson()

const postQuestMap = data.reduce(
  (acc: { [questId: number]: number[] }, cur) => {
    cur.prerequisite.forEach((pre) => {
      acc[pre]?.push(cur.game_id) ?? (acc[pre] = [cur.game_id])
    })
    return acc
  },
  {},
)

const buildDict = () => {
  const walkKeys = [
    'reward_other',
    'choices',
    'requirements',
    'list',
    'groups',
    'map',
    'ship',
    'name',
  ]
  const blockValues = ['艦']

  const walkQuest = (q: object | Array<any>): string[] => {
    if (!q) {
      return []
    }

    const walkEntries = Array.isArray(q)
      ? Object.values(q)
      : Object.keys(q)
          .filter((k) => walkKeys.includes(k))
          .map((k) => (q as any)[k])

    return [
      ...walkEntries
        .filter((v) => typeof v === 'string')
        .filter((v) => !blockValues.includes(v))
        .map((v) => v),
      ...walkEntries
        .filter((v) => typeof v === 'object')
        // @ts-ignore
        .flatMap((v) => walkQuest(v)),
    ]
  }

  const dictSet: { [k: string]: Set<number> } = {}
  data.forEach((q) => {
    const id = q.game_id
    const keywords = walkQuest(q)
    keywords.forEach((k) => {
      if (!dictSet[k]) dictSet[k] = new Set()
      dictSet[k].add(id)
    })
  })

  const dict: { [k: string]: number[] } = {}
  Object.entries(dictSet).forEach(([k, v]) => (dict[k] = Array.from(v)))
  return dict
}

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'data.json'),
  JSON.stringify(data, undefined, 2) + '\n',
)

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'data.min.json'),
  JSON.stringify(data),
)

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'post-quest.json'),
  JSON.stringify(postQuestMap, undefined, 2) + '\n',
)

fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'dict.json'),
  JSON.stringify(buildDict(), undefined, 2) + '\n',
)

const MD_PREFIX = '# Kantai Collection Quests\n\n'
fs.writeFileSync(
  path.resolve(OUTPUT_PATH, 'README.md'),
  MD_PREFIX +
    data.map((q) => `- ${q.game_id} ${q.wiki_id} ${q.name}`).join('\n'),
)

console.log('Build data done!')
