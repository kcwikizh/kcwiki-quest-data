import { mapKeys, mapValues, isObject, Dictionary } from 'lodash'

/**
 * deep object walk through
 * @param obj The object to iterate over.
 * @param cb The function invoked per iteration.
 * @see https://github.com/lodash/lodash/issues/1244
 */
export const mapKeysDeep = (
  obj: Dictionary<any>,
  cb: (value: any, key: string) => string
): Dictionary<any> => {
  // prevent convert arrays into objects with integer keys
  if (Array.isArray(obj)) {
    return obj.map(innerObj => mapKeysDeep(innerObj, cb))
  }
  if (isObject(obj)) {
    return mapValues(mapKeys(obj, cb), val => mapKeysDeep(val, cb))
  }
  return obj
}
