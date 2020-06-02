import React, { HTMLAttributes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Portal from '../portal';
import { getElementSize, getStyle, getStyleValue } from '../utils/get';
import throttleWithRAF from '../utils/throttleWithRAF';
import { supportRef, composeRef } from '../utils/ref';
import addEventListener, { ListenerEventHandler } from '../utils/addEventListener';
import getPopupLocation from './getPopupLocation';
import contains from '../utils/contains';
import { isTouchScreen } from '../utils/string';

function noop() {}

export type ArrowStyleProps =
  | {
      top: string;
      left: string;
      transform: string;
    }
  | {};

type PrevPopupSize = { width: number; height: number } | null;

interface TriggerStates {
  visible: boolean;
}

export interface TriggerProps {
  children: React.ReactElement;
  popup: React.ReactNode | (() => React.ReactNode);
  name?: string;
  placement?: string;
  trigger?: string;
  visible?: boolean;
  translateX?: number;
  translateY?: number;
  showMask?: boolean;
  monitorWindowResize?: boolean;
  mouseEnterDelay?: number; // 显示延迟时间 单位：秒
  mouseLeaveDelay?: number; // 隐藏延迟时间 单位：秒
  // 最多高度，超出显示滚动条
  maxHeight?: number;
  // 弹框最小宽度是 root 元素的宽度
  isMinRootWidth?: boolean;
  // 元素到弹框之间的间距
  rootToPopupSpacing?: number;
  // 弹框到边界的间距
  popupLimitSpacing?: number;
  // 动画原点方位， horizontal，circle
  isTransformHorizontalDirection?: boolean;
  hiddenArrow?: boolean;
  // 样式
  arrowClassName?: string;
  wrapClassName?: string;
  innerClassName?: string;
  closeClassName?: string;
  onVisibleChange?: (visible: boolean, name?: string) => void;
  getCurrentDOMNode?: (node: React.ReactInstance | null) => HTMLElement;
  onDestroy?: () => void;
  onArrowStyleChange?: (v: ArrowStyleProps) => void;
}

class Trigger extends React.Component<TriggerProps, TriggerStates> {
  static defaultProps = {
    placement: 'top',
    trigger: 'hover',
    translateX: 0,
    translateY: 0,
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0.1,
    monitorWindowResize: true,
    showMask: false,
    isMinRootWidth: false,
    rootToPopupSpacing: 14,
    popupLimitSpacing: 14,
    isTransformHorizontalDirection: false,
    hiddenArrow: false,
    onVisibleChange: noop,
    onDestroy: noop
  };

  prefixCls: string = 'ab-trigger';
  clickOutsideHandler: ListenerEventHandler | null;
  touchOutsideHandler: ListenerEventHandler | null;
  resizeHandler: ListenerEventHandler | null;
  hasPopupMouseDown: boolean;
  mouseDownTimeout: any;
  delayTimer: any;
  popupTimer: any;
  prevArrowStyle: ArrowStyleProps;

  popupRef = React.createRef<HTMLDivElement>();
  maskRef = React.createRef<HTMLDivElement>();

  triggerRef = React.createRef<React.ReactInstance>();

  isClickToHide = () => this.props.trigger.indexOf('click') !== -1;

  static getPopupInnerHeight(element) {
    if (element.children && element.children.length) {
      let height = getStyleValue(element, 'padding-top') + getStyleValue(element, 'padding-bottom');
      const childList = Array.from(element.children);
      childList.forEach(child => {
        height += getElementSize(child as HTMLElement).height;
      });
      return height;
    }
    return getElementSize(element).height;
  }

  constructor(props: TriggerProps) {
    super(props);
    this.state = {
      visible: false
    };
  }
  static getDerivedStateFromProps(nextProps: TriggerProps) {
    if ('visible' in nextProps) {
      return { visible: nextProps.visible };
    }
    return null;
  }

  componentDidMount() {
    this.componentDidUpdate();
  }
  getSnapshotBeforeUpdate(): PrevPopupSize {
    const popupEl = this.getPopupDomNode();
    if (this.state.visible && popupEl) {
      const displayValue = getStyle(popupEl, 'display');
      if (displayValue === 'none') {
        return null;
      }
      return getElementSize(popupEl);
    }
    return null;
  }
  componentDidUpdate(
    _prevProps?: TriggerProps,
    _prevState?: TriggerStates,
    prevPopupSize?: PrevPopupSize
  ) {
    const { visible } = this.state;
    if (!visible) {
      this.clearOutsideHandler();
      return;
    }
    const popupEl = this.getPopupDomNode();
    // 加入 resize 监听
    if (this.props.monitorWindowResize && !this.resizeHandler) {
      this.resizeHandler = addEventListener(
        window,
        'resize',
        throttleWithRAF(() => this.forceAlign(popupEl))
      );
    }

    // 需要监听 `mousedown` or `touchstart`, 而不是click
    let currentDocument;
    const touch = isTouchScreen();
    if (!this.clickOutsideHandler && !touch && this.isClickToHide()) {
      currentDocument = window.document;
      this.clickOutsideHandler = addEventListener(
        currentDocument,
        'mousedown',
        this.onDocumentClick
      );
    }
    // always hide on mobile
    if (!this.touchOutsideHandler) {
      currentDocument = currentDocument || window.document;
      this.touchOutsideHandler = addEventListener(
        currentDocument,
        'touchstart',
        this.onDocumentClick
      );
    }

    if (popupEl && prevPopupSize) {
      const { width, height } = getElementSize(popupEl);
      if (prevPopupSize.width !== width || prevPopupSize.height !== height) {
        this.clearPopupTimer(popupEl);
        popupEl.style.visibility = 'hidden';
        this.popupTimer = setTimeout(() => {
          this.forceAlign(popupEl);
          popupEl.style.visibility = '';
        });
      }
    }
  }

  componentWillUnmount() {
    // remove绑定事件
    this.clearOutsideHandler();
  }

  clearPopupTimer = (popupEl?: HTMLElement) => {
    clearTimeout(this.popupTimer);
    const element = popupEl || this.getPopupDomNode();
    if (element) {
      element.style.visibility = '';
    }
  };

  forceAlign = (popupEl: HTMLElement) => {
    const rootEl = this.getRootDomNode();
    if (!popupEl || !rootEl) {
      return;
    }
    this.clearPopupTimer(popupEl);
    const {
      placement,
      translateX,
      translateY,
      rootToPopupSpacing,
      popupLimitSpacing,
      isTransformHorizontalDirection,
      hiddenArrow,
      onArrowStyleChange,
      maxHeight,
      isMinRootWidth
    } = this.props;

    // 计算Popup元素应该显示的位置
    const { left, top, arrowStyle, transformOrigin, rootWidth } = getPopupLocation(
      placement!,
      rootEl,
      popupEl,
      translateX!,
      translateY!,
      rootToPopupSpacing!,
      popupLimitSpacing,
      isTransformHorizontalDirection!,
      hiddenArrow!
    );
    if (
      !hiddenArrow &&
      onArrowStyleChange &&
      JSON.stringify(arrowStyle) !== JSON.stringify(this.prevArrowStyle)
    ) {
      this.prevArrowStyle = arrowStyle;
      onArrowStyleChange(arrowStyle);
    }

    popupEl.style.transformOrigin = transformOrigin;
    popupEl.style.left = `${left}px`;
    popupEl.style.top = `${top}px`;
    if (maxHeight) {
      const height = Trigger.getPopupInnerHeight(popupEl);
      if (maxHeight < height) {
        popupEl.style.overflowY = 'scroll';
        popupEl.style.maxHeight = `${maxHeight}px`;
      }
    }

    if (isMinRootWidth) {
      popupEl.style.minWidth = `${rootWidth}px`;
    }
  };

  getRootDomNode = (): HTMLElement | null => {
    const { getCurrentDOMNode } = this.props;
    if (getCurrentDOMNode) {
      return getCurrentDOMNode(this.triggerRef.current);
    }

    try {
      const domNode = findDOMNode(this.triggerRef.current) as HTMLElement;
      if (domNode) {
        return domNode;
      }
    } catch (err) {}

    return null;
  };

  getPopupDomNode() {
    if (this.popupRef && this.popupRef.current) {
      return this.popupRef.current;
    }
    return null;
  }

  getMaskDomNode() {
    if (this.maskRef && this.maskRef.current) {
      return this.maskRef.current;
    }
    return null;
  }

  clearOutsideHandler() {
    // clearTimeout(this.mouseDownTimeout);
    clearTimeout(this.delayTimer);
    this.clearPopupTimer();
    if (this.resizeHandler) {
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.remove();
      this.clickOutsideHandler = null;
    }

    if (this.touchOutsideHandler) {
      this.touchOutsideHandler.remove();
      this.touchOutsideHandler = null;
    }
  }
  /**
   * 全局事件回调
   * @param event
   */
  onDocumentClick = (event: any) => {
    if (!this.state.visible) {
      return;
    }

    const target = event.target;
    const root = this.getRootDomNode();
    const popupNode = this.getPopupDomNode();

    if (!root || !target || !popupNode) {
      return;
    }
    const showMask = this.props.showMask;
    const maskEl = this.getMaskDomNode();
    if (showMask && !maskEl) {
      return;
    }
    // 排除操作当前元素
    if (
      !contains(root, target) &&
      (!showMask || maskEl === target) &&
      !contains(popupNode, target) &&
      !this.hasPopupMouseDown
    ) {
      this.hidePopup();
    }
  };

  showPopup = () => {
    this.triggerPopup(true);
  };
  hidePopup = (ev?: any) => {
    if (ev) {
      ev.stopPropagation();
      ev.nativeEvent.stopImmediatePropagation();
    }
    this.triggerPopup(false);
  };

  delaySetPopupVisible(visible: boolean, delayTime: number) {
    clearTimeout(this.delayTimer);
    if (delayTime) {
      const delay = delayTime * 1000;
      this.delayTimer = setTimeout(() => {
        this.triggerPopup(visible);
        clearTimeout(this.delayTimer);
      }, delay);
    } else {
      this.triggerPopup(visible);
    }
  }
  onVisibleChange = (visible: boolean) => {
    const prevVisible = this.state.visible;

    clearTimeout(this.delayTimer);

    if (prevVisible !== visible) {
      if (!this.isOutsideControl()) {
        this.setState({ visible: visible });
      }
      const { onVisibleChange, name } = this.props;
      if (onVisibleChange) {
        onVisibleChange(visible, name);
      }
    }
  };
  /**
   * 设置显示与隐藏
   * @param nextVisible
   */
  triggerPopup = (nextVisible: boolean) => {
    if (nextVisible) {
      this.hasPopupMouseDown = true;
      // 禁止执行全局监听，回调函数中的隐藏功能
      clearTimeout(this.mouseDownTimeout);
      this.mouseDownTimeout = setTimeout(() => {
        this.hasPopupMouseDown = false;
      }, 0);
    }
    this.onVisibleChange(nextVisible);
  };
  onPopupMouseDown = () => {
    this.hasPopupMouseDown = true;

    clearTimeout(this.mouseDownTimeout);
    this.mouseDownTimeout = setTimeout(() => {
      this.hasPopupMouseDown = false;
    }, 0);
  };

  onClick = (event: React.TouchEvent | React.MouseEvent) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const touch = isTouchScreen();
    if ((event.type === 'touchstart' && touch) || (event.type === 'mousedown' && !touch)) {
      this.triggerPopup(!this.state.visible);
    }
  };

  onMouseEnter = () => {
    this.delaySetPopupVisible(true, this.props.mouseEnterDelay!);
  };

  onMouseLeave = () => {
    this.delaySetPopupVisible(false, this.props.mouseLeaveDelay!);
  };

  onPopupMouseEnter = () => {
    clearTimeout(this.delayTimer);
  };

  onPopupMouseLeave = () => {
    this.delaySetPopupVisible(false, this.props.mouseLeaveDelay!);
  };

  onExited = () => {
    this.clearPopupTimer();
    const { onDestroy } = this.props;
    if (onDestroy) {
      onDestroy();
    }
  };

  isCurrentTrigger = (eventName: string, trigger: string) => trigger.indexOf(eventName) !== -1;
  isOutsideControl = () => 'visible' in this.props;

  renderMask() {
    const { visible } = this.state;
    const { showMask } = this.props;
    if (showMask && visible) {
      return <div className={`${this.prefixCls}-mask`} ref={this.maskRef} />;
    }
    return null;
  }

  renderPopupContent() {
    const cls = this.prefixCls;
    const { popup, wrapClassName, trigger, isTransformHorizontalDirection } = this.props;
    const { visible } = this.state;
    const wrapClass = classNames(`${cls}-wrap`, wrapClassName);

    // hover 下，对popup增加相应的事件，延迟隐藏，可以在弹框中停留
    const mouseProps: HTMLAttributes<HTMLElement> = {};
    if (this.isCurrentTrigger('hover', trigger)) {
      mouseProps.onMouseEnter = this.onPopupMouseEnter;
      mouseProps.onMouseLeave = this.onPopupMouseLeave;
    }
    mouseProps.onMouseDown = this.onPopupMouseDown;
    mouseProps.onTouchStart = this.onPopupMouseDown;
    return (
      <CSSTransition
        in={visible}
        onEnter={this.forceAlign}
        timeout={200}
        classNames={`${cls}-fade${isTransformHorizontalDirection ? '-hr' : ''}`}
        onExited={this.onExited}
        appear
      >
        <div {...mouseProps} className={wrapClass} ref={this.popupRef}>
          {typeof popup === 'function' ? popup() : popup}
        </div>
      </CSSTransition>
    );
  }

  /**
   * 扩充children属性，根据trigger绑定不同事件
   */
  renderChildComponent() {
    const { children, trigger } = this.props;
    const child = React.Children.only(children) as React.ReactElement;
    const newChildProps: HTMLAttributes<HTMLElement> & { key: string } = {
      key: 'trigger'
    };
    if (this.isCurrentTrigger('hover', trigger)) {
      newChildProps.onMouseEnter = this.onMouseEnter;
      newChildProps.onMouseLeave = this.onMouseLeave;
    }
    if (!this.isOutsideControl()) {
      if (this.isCurrentTrigger('click', trigger)) {
        newChildProps.onMouseDown = this.onClick;
        newChildProps.onTouchStart = this.onClick;
      }
      if (this.isCurrentTrigger('focus', trigger)) {
        newChildProps.onFocus = this.showPopup;
        newChildProps.onBlur = this.hidePopup;
      }
    }
    const cloneProps: any = {
      ...newChildProps
    };

    if (supportRef(child)) {
      cloneProps.ref = composeRef(this.triggerRef, (child as any).ref);
    }
    // 对当前children元素添加额外属性
    return React.cloneElement(child, cloneProps);
  }
  renderPopupComponent() {
    if (this.state.visible || this.popupRef.current) {
      return (
        <Portal>
          <React.Fragment>
            {this.renderMask()}
            {this.renderPopupContent()}
          </React.Fragment>
        </Portal>
      );
    }
    return null;
  }
  render() {
    return (
      <React.Fragment>
        {this.renderChildComponent()}
        {this.renderPopupComponent()}
      </React.Fragment>
    );
  }
}

export default Trigger;
