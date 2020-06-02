import React from 'react';
import * as ReactIs from 'react-is';
import classNames from 'classnames';
import addEventListener, { ListenerEventHandler } from '../utils/addEventListener';
import { isTouchScreen, isEmptyObject } from '../utils/string';
import { getElementSize } from '../utils/get';
import { Position, getDistance, getInitElementPlacement, getTransformOrigin } from './utils';
import throttleWithRAF from '../utils/throttleWithRAF';

const defaultPosition: Readonly<Position> = {
  x: 0,
  y: 0
};

export interface MoveProps {
  children: React.ReactElement;
  name?: string;
  scalable?: boolean;
  monitorWindowResize?: boolean;
  minScalable?: number;
  maxScalable?: number;
  horizontalPlacement?: 'left' | 'center' | 'right';
  verticalPlacement?: 'top' | 'center' | 'bottom';
  onAfterChange?: (name?: string) => void;
  onClick?: (event) => void;
}

export default class Move extends React.Component<MoveProps, any> {
  readonly prefixCls = 'ab-move';

  static defaultProps = {
    scalable: true,
    monitorWindowResize: true,
    minScalable: 1,
    // TODO:: 当有缩放时，会出现origin不同抖动问题，暂时做成：放大后再回去的
    maxScalable: 1,
    horizontalPlacement: 'left',
    verticalPlacement: 'top'
  };

  prevElementSize = { width: 0, height: 0 };
  elementSize = { width: 0, height: 0 };
  elementParentSize = { width: 0, height: 0 };
  startObj = { ...defaultPosition };
  prevObj = { ...defaultPosition };
  currentObj = { ...defaultPosition };
  moveObj = { ...defaultPosition };

  prevScaleSize = 1;
  currentScaleSize = 1;
  scaleStart = 0;
  scaleEnd = 0;

  isTouchScale: boolean = false;

  // 强制刷新元素位置
  isForceUpdatePlacement: boolean = false;

  moveRef = React.createRef<HTMLElement>();

  resizeHandler: ListenerEventHandler | null;
  startHandler: ListenerEventHandler | null;
  moveHandler: ListenerEventHandler | null;
  endHandler: ListenerEventHandler | null;

  updateTimer = null;

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.isForceUpdatePlacement = true;
    this.componentDidUpdate();
  }
  componentDidUpdate(prevProps?: MoveProps) {
    clearTimeout(this.updateTimer);
    const element = this.getDomNode();
    if (!element) {
      return;
    }
    const parentNode = element.parentNode as HTMLElement;
    if (!parentNode) {
      return;
    }

    parentNode.style.overflow = 'hidden';

    const { horizontalPlacement, verticalPlacement } = this.props;
    if (
      prevProps &&
      (horizontalPlacement !== prevProps.horizontalPlacement ||
        verticalPlacement !== prevProps.verticalPlacement)
    ) {
      this.isForceUpdatePlacement = true;
    }

    this.updateTimer = setTimeout(() => {
      this.refreshInfo(element, prevProps);
      if (!this.startHandler) {
        const eventType = isTouchScreen() ? 'touchstart' : 'mousedown';
        this.startHandler = addEventListener(element, eventType, ev => this.onStart(ev, element));
      }

      // 加入 resize 监听
      if (this.props.monitorWindowResize && !this.resizeHandler) {
        this.resizeHandler = addEventListener(
          window,
          'resize',
          throttleWithRAF(() => this.refreshInfo(element, prevProps))
        );
      }
    }, 0);

    this.clearHandler();
  }

  componentWillUnmount(): void {
    clearTimeout(this.updateTimer);
    if (this.startHandler) {
      this.startHandler.remove();
      this.startHandler = null;
    }
    if (this.resizeHandler) {
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
    this.clearHandler();
  }

  clearHandler() {
    if (this.moveHandler) {
      this.moveHandler.remove();
      this.moveHandler = null;
    }
    if (this.endHandler) {
      this.endHandler.remove();
      this.endHandler = null;
    }
  }

  refreshInfo = (el, prevProps) => {
    const element = el || this.getDomNode();
    if (!element) {
      return;
    }
    const parentNode = element.parentNode as HTMLElement;
    if (!parentNode) {
      return;
    }
    const elementSize = getElementSize(element);
    this.elementSize = {
      width: elementSize.width,
      height: elementSize.height
    };

    if (
      this.elementSize.width !== this.prevElementSize.width ||
      this.elementSize.height !== this.prevElementSize.height
    ) {
      this.isForceUpdatePlacement = true;
    }

    this.prevElementSize = this.elementSize;
    this.elementParentSize = getElementSize(parentNode, true);

    const { horizontalPlacement, verticalPlacement } = this.props;
    if (
      !prevProps ||
      this.isForceUpdatePlacement ||
      horizontalPlacement !== prevProps.horizontalPlacement ||
      verticalPlacement !== prevProps.verticalPlacement
    ) {
      this.currentObj = getInitElementPlacement({
        horizontalPlacement,
        verticalPlacement,
        elementSize: this.elementSize,
        elementParentSize: this.elementParentSize
      });
      const { nextScaleSize, nextX, nextY } = this.checkRange();
      this.currentObj = {
        x: nextX,
        y: nextY
      };
      this.currentScaleSize = nextScaleSize;
      this.setElementInfo(element);
      element.style.visibility = 'visible';
      this.isForceUpdatePlacement = false;
    }
  };

  public resetTranslate = (info: Position) => {
    const element = this.getDomNode();
    if (isEmptyObject(info) || !element) {
      return;
    }
    this.currentObj = info;
    element.style.transition = 'transform 200ms ease-in-out';
    const { nextX, nextY, nextScaleSize, isRefresh } = this.checkRange();
    if (isRefresh) {
      this.currentObj = {
        x: nextX,
        y: nextY
      };
      this.currentScaleSize = nextScaleSize;
    }
    this.setElementInfo(element);
  };

  onStart = (event, element) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    this.isTouchScale = false;

    element.style.transition = '';
    element.style.transformOrigin = '';

    const scalable = this.props.scalable;
    const isTouch = isTouchScreen();
    this.prevScaleSize = this.currentScaleSize;
    if (scalable && isTouch && event.touches.length > 1) {
      this.isTouchScale = true;
      // 记录双指的间距长度
      this.scaleStart = getDistance(event.touches);
      // 设置缩放原点
      element.style.transformOrigin = getTransformOrigin(
        event.touches,
        element.parentNode,
        this.currentObj
      );
    } else {
      this.moveObj = { ...defaultPosition };
      this.prevObj = { ...this.currentObj };
      this.startObj = {
        x: event.touches ? event.touches[0].pageX : event.clientX,
        y: event.touches ? event.touches[0].pageY : event.clientY
      };
    }

    if (!this.moveHandler) {
      this.moveHandler = addEventListener(
        window.document,
        isTouch ? 'touchmove' : 'mousemove',
        ev => this.onMove(ev, element)
      );
    }

    if (!this.endHandler) {
      this.endHandler = addEventListener(window.document, isTouch ? 'touchend' : 'mouseup', ev =>
        this.onEnd(ev, element)
      );
    }
  };
  onMove = (event, element) => {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (this.isTouchScale && event.touches.length > 1) {
      this.scaleEnd = getDistance(event.touches);
      // 设置缩放尺寸
      this.currentScaleSize = (this.scaleEnd / this.scaleStart - 1) / 2 + this.prevScaleSize;
      this.setElementInfo(element);
      return;
    }

    if (this.isTouchScale && event.touches.length <= 1) {
      return;
    }

    this.moveObj = {
      x: event.touches ? event.touches[0].pageX : event.clientX,
      y: event.touches ? event.touches[0].pageY : event.clientY
    };
    this.currentObj = {
      x: this.prevObj.x + this.moveObj.x - this.startObj.x,
      y: this.prevObj.y + this.moveObj.y - this.startObj.y
    };
    this.setElementInfo(element);
  };
  onEnd = (event, element) => {
    this.clearHandler();
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    const { nextX, nextY, nextScaleSize, isRefresh } = this.checkRange();
    if (isRefresh) {
      element.style.transition = 'transform 200ms ease-in-out';
      this.currentObj = {
        x: nextX,
        y: nextY
      };
      this.currentScaleSize = nextScaleSize;
      this.setElementInfo(element);
    }
    const onClick = this.props.onClick;
    if (
      onClick &&
      this.currentObj.x === this.prevObj.x &&
      this.currentObj.y === this.prevObj.y &&
      this.prevScaleSize === this.currentScaleSize
    ) {
      onClick(event);
    }
  };

  checkRange() {
    let { x, y } = this.currentObj;
    const elementSize = this.elementSize;

    let nextScaleSize = this.currentScaleSize;
    if (this.props.scalable) {
      if (this.currentScaleSize > this.props.maxScalable) {
        nextScaleSize = this.props.maxScalable;
      } else if (this.currentScaleSize < this.props.minScalable) {
        nextScaleSize = this.props.minScalable;
      }
    }

    const width = elementSize.width * nextScaleSize;
    const height = elementSize.height * nextScaleSize;
    const expendHalfSize = (nextScaleSize - this.props.minScalable) / 2;
    const widthHalfSize = elementSize.width * expendHalfSize;
    const heightHalfSize = elementSize.height * expendHalfSize;

    const leftLimit = nextScaleSize > this.props.minScalable ? widthHalfSize : 0;
    const topLimit = nextScaleSize > this.props.minScalable ? heightHalfSize : 0;

    const pSize = this.elementParentSize;
    let nextX = x;
    let nextY = y;

    // 内容小于或等于父级时，左右滑动不能超出
    if (pSize.width >= width) {
      if (x < leftLimit) {
        nextX = leftLimit;
      } else if (x + width - widthHalfSize > pSize.width) {
        nextX = pSize.width - width + widthHalfSize;
      }
    } else {
      // 内容大于父级时，左右滑动时，右边可以滑动到内容最右边
      if (x > leftLimit) {
        nextX = leftLimit;
      } else if (pSize.width > width + x - widthHalfSize) {
        nextX = pSize.width - width + widthHalfSize;
      }
    }
    if (pSize.height >= height) {
      if (y < topLimit) {
        nextY = topLimit;
      } else if (y + height - heightHalfSize > pSize.height) {
        nextY = pSize.height - height + heightHalfSize;
      }
    } else {
      // 内容大于父级时，左右滑动时，右边可以滑动到内容最右边
      if (y > topLimit) {
        nextY = topLimit;
      } else if (pSize.height > height + y - heightHalfSize) {
        nextY = pSize.height - height + heightHalfSize;
      }
    }

    return {
      isRefresh: nextX !== x || nextY !== y || nextScaleSize !== this.currentScaleSize,
      nextX,
      nextY,
      nextScaleSize
    };
  }

  setElementInfo(element) {
    element.style.transform = `translate(${this.currentObj.x}px, ${this.currentObj.y}px) scale(${
      this.currentScaleSize
    })`;
  }

  onTransitionEnd = () => {
    const element = this.getDomNode();
    if (!element) {
      return;
    }
    element.style.transition = '';
    // 清除缩放原点
    element.style.transformOrigin = '';

    const { onAfterChange, name } = this.props;

    if (onAfterChange) {
      onAfterChange(name);
    }
  };

  getDomNode() {
    if (this.moveRef && this.moveRef.current) {
      return this.moveRef.current;
    }
    return null;
  }

  render() {
    const { children } = this.props;
    const child = React.Children.only(children) as React.ReactElement;
    if (ReactIs.isElement(child) && !ReactIs.isFragment(child)) {
      return React.cloneElement(child, {
        ref: this.moveRef,
        onTransitionEnd: this.onTransitionEnd,
        className: classNames(this.prefixCls, child.props.className)
      });
    }
    throw new Error('Move component only support HTMLElement!');
  }
}
