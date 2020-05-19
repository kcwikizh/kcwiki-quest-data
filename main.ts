import { Quest } from './types'
import data from './build/data.json'

export * from './types'
export const questData = data as Quest[]
