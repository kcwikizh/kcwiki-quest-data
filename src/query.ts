import dict from '../build/dict.json'

export const queryWord = (word: string): number[] => {
  if (typeof word !== 'string' || word === '') {
    return []
  }
  word = word.toLowerCase()

  const set = new Set<number>()
  Object.keys(dict)
    .filter((dictKey) => {
      return dictKey.includes(word)
    })
    // .map((hit) => (console.log('[Hit]', hit), hit))
    .flatMap((k) => dict[k as keyof typeof dict])
    .forEach((questId) => set.add(questId))
  return Array.from(set)
}

export const query = (words: string) => {
  const countMap = words
    .split(/\s+/)
    .flatMap((word) => queryWord(word))
    .reduce((cntMap, questId) => {
      cntMap[questId] = (cntMap[questId] || 0) + 1
      return cntMap
    }, {} as { [k: number]: number })

  // sort by count occurrence
  return Object.keys(countMap)
    .sort(
      (a, b) =>
        countMap[(b as unknown) as keyof typeof countMap] -
        countMap[(a as unknown) as keyof typeof countMap],
    )
    .map((strId) => +strId)
}

// Check if this module is the main module
// `node_modules/.bin/ts-node src/query.ts A01` for debug
if (require.main === module) {
  console.log(query(process.argv.slice(2).join(' ')))
}
