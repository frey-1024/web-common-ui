import { getStyleValue } from './get';
import { getScrollBarSize } from './getScrollBarSize';

export function isBlank(val) {
  return isUndef(val) || val === '' || val.toString().trim() === '';
}

export function isAllBlank(...args) {
  return args.every(arg => isBlank(arg));
}
export function isAllFull(...args) {
  return args.every(arg => !isBlank(arg));
}

export function isUndef(val) {
  return val === null || typeof val === 'undefined';
}

export function isEmptyObject(obj) {
  return !obj || Object.keys(obj).length <= 0;
}

const objToString = Object.prototype.toString;
export function isObject(obj) {
  return objToString.call(obj) === '[object Object]';
}
export function isArray(obj) {
  return objToString.call(obj) === '[object Array]';
}

export function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]';
}

export function isEmptyArray(obj) {
  return !isArray(obj) || obj.length <= 0;
}

export function hasHorizontalScrollbar(prevScrollSize) {
  const paddingBottom = getStyleValue(window.document.body, 'paddingBottom');
  const scrollSize = prevScrollSize || getScrollBarSize();
  return (
    (paddingBottom !== 0 && paddingBottom === scrollSize) ||
    document.body.scrollWidth > (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function hasVerticalScrollbar(prevScrollSize) {
  const paddingRight = getStyleValue(window.document.body, 'paddingRight');
  const scrollSize = prevScrollSize || getScrollBarSize();
  return (
    (paddingRight !== 0 && paddingRight === scrollSize) ||
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)
  );
}

export function hasScrollbar(prevScrollSize) {
  const scrollSize = prevScrollSize || getScrollBarSize();
  return hasVerticalScrollbar(scrollSize) || hasHorizontalScrollbar(scrollSize);
}

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export function isTouchScreen() {
  return canUseDOM && 'ontouchstart' in document.documentElement;
}
