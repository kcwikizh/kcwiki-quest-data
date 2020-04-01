import fs from 'fs'
import path from 'path'
import { mapKeys, mapValues, isObject } from 'lodash'
import { Quest } from '../types'

/**
 * deep object walk through
 * @param obj The object to iterate over.
 * @param cb The function invoked per iteration.
 * @see https://github.com/lodash/lodash/issues/1244
 */
export const mapKeysDeep = (
  obj: object | any[],
  cb: (value: any, key: string) => string,
): ReturnType<typeof mapKeys> => {
  // prevent convert arrays into objects with integer keys
  if (Array.isArray(obj)) {
    return obj.map((innerObj) => mapKeysDeep(innerObj, cb))
  }
  if (isObject(obj)) {
    return mapValues(mapKeys(obj, cb), (val) => mapKeysDeep(val, cb))
  }
  return obj
}

export const mapValuesDeep = (
  obj: object | any[],
  cb: Function,
): ReturnType<typeof mapValues> => {
  if (Array.isArray(obj)) {
    return obj.map((innerObj) => mapValuesDeep(innerObj, cb))
  }
  if (isObject(obj)) {
    return mapValues(obj, (val) => mapValuesDeep(val, cb))
  }
  return cb(obj)
}

export const loadAllJson = (folder = 'data'): Quest[] =>
  fs
    .readdirSync(folder)
    .map((filename) => path.resolve(folder, filename))
    .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
