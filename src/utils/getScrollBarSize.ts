import { getStyleValue } from './get';

let cached;

/**
 * 获取滚动条大小
 * @param fresh
 */
export function getScrollBarSize(fresh?: boolean): number {
  if (typeof document === 'undefined') {
    return 0;
  }

  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = '0px';
    outerStyle.left = '0px';
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }
  return cached;
}

export function hasScrollbar() {
  const currentDocument = document.body;
  if (
    currentDocument.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)
  ) {
    return true;
  }
  const paddingRight = getStyleValue(currentDocument, 'padding-right');
  const scrollSize = getScrollBarSize();
  return paddingRight > 0 && paddingRight === scrollSize;
}
