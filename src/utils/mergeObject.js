import { isObject } from './string';

/**
 * 合并两个对象，支持深合并
 * @param obj1
 * @param obj2
 * @param isDepth
 * @returns {{}}
 */
export default function mergeObject(obj1 = {}, obj2 = {}, isDepth = false) {
  if (!isDepth) {
    return { ...obj1, ...obj2 };
  }
  const result = { ...obj1 };
  let val;
  Object.keys(obj2).forEach(key => {
    val = obj2[key];
    if (isObject(val) && isObject(result[key])) {
      result[key] = { ...result[key], ...val };
    } else {
      result[key] = val;
    }
  });
  return result;
}
