export function getClientPosition(elem: HTMLElement) {
  let box;
  let x;
  let y;
  const doc = elem.ownerDocument;
  if (!doc) {
    return {
      left: 0,
      top: 0
    };
  }
  const body = doc.body;
  const docElem = doc.documentElement;
  box = elem.getBoundingClientRect();

  x = box.left;
  y = box.top;

  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;

  return {
    left: x,
    top: y
  };
}

export function getElementSize(elem: HTMLElement, isRemoveBorder?: boolean) {
  if (isRemoveBorder) {
    return {
      width: elem.clientWidth,
      height: elem.clientHeight
    };
  }
  return {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
}

export function getClientSize() {
  // TODO:: window.innerWidth = document.documentElement.clientWidth + scrollWidth，
  //  innerWidth在Chrome模拟器上有问题， 可手动缩小屏幕进行解决， 或者使用兼容的写法
  //  https://stackoverflow.com/questions/36297612/window-innerwidth-in-chromes-device-mode
  //  可使用window.visualViewport.width进行代替，但是这个兼容性很差
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height:
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}

export function getOffset(elem: HTMLElement) {
  const { left, top } = getClientPosition(elem);
  const { width, height } = getElementSize(elem);
  // 需要处理滚动
  return {
    left: left + (document.body.scrollLeft + document.documentElement.scrollLeft),
    top: top + (document.body.scrollTop + document.documentElement.scrollTop),
    width,
    height
  };
}

/**
 * 获取执行元素的属性值
 * @param element
 * @param attr
 * @returns {string}
 */
export function getStyle(element: any, attr: any) {
  return element.currentStyle ? element.currentStyle[attr] : getComputedStyle(element, null)[attr];
}

export function getStyleValue(element: any, attr: any): number {
  const str = getStyle(element, attr);
  const value = parseFloat(str);
  return isNaN(value) ? 0 : value;
}
