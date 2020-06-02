import { jointParamsToStr } from '../urlSearch';

/**
 * @param url
 * @param params
 */

export function ajax(url, params) {
  try {
    new Image().src = `${url}${jointParamsToStr(params)}`;
  } catch (e) {}
}

export function sendBeacon(url, params) {
  const search = jointParamsToStr(params);
  if (window.navigator && window.navigator.sendBeacon) {
    window.navigator.sendBeacon(`${url}${search}`, '');
    return;
  }
  new Image().src = `${url}${search}`;
}
