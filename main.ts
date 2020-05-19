import { Quest } from './types'
import data from './build/data.json'

export { translation } from './build/i18n'
export * from './types'
export const questData = data as Quest[]
