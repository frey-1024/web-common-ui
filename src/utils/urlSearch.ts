/**
 * 获取url中的query
 * @param name query的名字
 * @returns {*}
 */
import { isBlank } from './string';

export function getUrlParamByName(name: string) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`); // 构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg); // 匹配目标参数
  if (r !== null) return decodeURIComponent(r[2]);
  return '';
}

/**
 * 解析所有Url中的params
 * @returns {{}}
 */
export function getUrlParams(value?: string) {
  const search = value || window.location.search;
  if (search.length <= 0) return {};
  const info = search.slice(1);
  const result = {};
  const placeholder = {};
  let index = 0;
  const replaceInfo = info.replace(/=\(([^\)]+)\)/g, (_$1, $2) => {
    const str = `$_${index}`;
    placeholder[str] = decodeURIComponent($2);
    index++;
    return `=${str}`;
  });

  replaceInfo.split('&').forEach(item => {
    const itemArr = item.split('=');
    const encodeValue = itemArr[1];
    const value = placeholder[encodeValue]
      ? placeholder[encodeValue]
      : decodeURIComponent(encodeValue);
    // 判断字符串true
    result[decodeURIComponent(itemArr[0])] = value !== 'true' ? value : true;
  });
  return result;
}

/**
 * 合并剩余参数
 * @param url
 * @param params
 * @returns {*}
 */
export function jointParamsToStr(params: object, url = '') {
  const keys = Object.keys(params);
  if (!keys.length) {
    return url;
  }
  let joinStr = '?';
  keys.forEach(key => {
    const value = params[key];
    if (isBlank(value)) {
      return;
    }
    url += `${joinStr}${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    joinStr = '&';
  });
  return url;
}
