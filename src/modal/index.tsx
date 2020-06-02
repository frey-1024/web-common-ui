import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import Portal from '../portal';
import Title from './Title';
import addEventListener, { ListenerEventHandler } from '../utils/addEventListener';
import { hasVerticalScrollbar } from '../utils/string';
import Mask from '../mask';
import { getElementSize, getStyle } from '../utils/get';
import getPopupLocation, { PopupLocationArgs } from './getPopupLocation';
import { getScrollBarSize } from '../utils/getScrollBarSize';
import contains from '../utils/contains';

function getId() {
  try {
    return new Date().getTime();
  } catch (e) {
    return Math.random();
  }
}

type PrevPopupSize = { width: number; height: number } | null;

export interface ModalProps {
  visible: boolean;
  title?: React.ReactElement;
  className?: string;
  placement?: 'center' | 'top';
  // 弹框到边界的间距
  popupLimitSpacing?: number;
  width?: string;
  height?: string;
  top?: string;
  name?: string;
  closable?: boolean;
  maskClosable?: boolean;
  hiddenScroll?: boolean;
  keyboard?: boolean;
  onClose?: (event: React.TouchEvent | React.MouseEvent, name?: string) => void;
  onOpened?: (name?: string) => void;
  onDestroy?: (name?: string) => void;
  getNotCloseElement?: () => HTMLElement;
}

export default class Modal extends React.Component<ModalProps> {
  static cacheOpenedIds: number[] = [];
  openId: number = getId();

  prefixCls = 'ab-modal';

  scrollBarSize: number = 0;

  // 默认值
  static defaultProps = {
    placement: 'center',
    width: '6.5rem',
    height: 'auto',
    top: '10%',
    popupLimitSpacing: 14,
    closable: true,
    keyboard: false,
    maskClosable: true,
    hiddenScroll: true
  };

  clickOutsideHandler: ListenerEventHandler | null;
  touchOutsideHandler: ListenerEventHandler | null;

  popupTimer: any;

  popupRef = React.createRef<HTMLDivElement>();
  maskRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.scrollBarSize = getScrollBarSize();
    this.componentDidUpdate();
  }

  getSnapshotBeforeUpdate(): PrevPopupSize {
    const popupEl = this.getPopupDomNode();
    if (this.props.visible && popupEl) {
      const displayValue = getStyle(popupEl, 'display');
      if (displayValue === 'none') {
        return null;
      }
      return getElementSize(popupEl);
    }
    return null;
  }

  componentDidUpdate(_prevProps?: ModalProps, _prevState?: any, prevPopupSize?: PrevPopupSize) {
    if (!this.props.visible) {
      this.clearOutsideHandler();
      return;
    }

    let currentDocument;
    if (!this.clickOutsideHandler) {
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
    if (!prevPopupSize) {
      return;
    }
    const popupEl = this.getPopupDomNode();
    if (popupEl && prevPopupSize) {
      const { width, height } = getElementSize(popupEl);
      if (prevPopupSize.width !== width || prevPopupSize.height !== height) {
        this.clearPopupTimer(popupEl);
        popupEl.style.visibility = 'hidden';
        this.popupTimer = setTimeout(() => {
          this.onEnter(popupEl);
          popupEl.style.visibility = '';
        });
      }
    }
  }
  componentWillUnmount() {
    // remove绑定事件
    this.clearOutsideHandler();
    this.onExited();
  }

  /**
   * 全局事件回调
   * @param event
   */
  onDocumentClick = (event: any) => {
    if (!this.props.visible) {
      return;
    }
    const target = event.target;
    const popupEl = this.getPopupDomNode();
    const maskEl = this.getMaskDomNode();
    if (!target || !popupEl || !maskEl) {
      return;
    }
    let notCloseElement;
    if (this.props.getNotCloseElement) {
      notCloseElement = this.props.getNotCloseElement();
    }
    // 排除操作当前元素
    if (
      (!contains(popupEl, target) && (maskEl === target || target === popupEl.parentNode)) ||
      (notCloseElement && !contains(notCloseElement, target))
    ) {
      this.onClose(target);
    }
  };

  clearOutsideHandler() {
    this.clearPopupTimer();
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.remove();
      this.clickOutsideHandler = null;
    }

    if (this.touchOutsideHandler) {
      this.touchOutsideHandler.remove();
      this.touchOutsideHandler = null;
    }
  }
  clearPopupTimer = (popupEl?: HTMLElement) => {
    clearTimeout(this.popupTimer);
    const element = popupEl || this.getPopupDomNode();
    if (element) {
      element.style.visibility = '';
    }
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

  onClose = event => {
    const { maskClosable, onClose, name } = this.props;
    if (maskClosable && onClose) {
      onClose(event, name);
    }
  };

  onEnter = (popupEl?: HTMLElement) => {
    const element = popupEl || this.getPopupDomNode();
    if (!element) {
      return;
    }
    if (element && element.parentNode) {
      const parentNode = element.parentNode as HTMLElement;
      parentNode.style.display = 'block';
    }

    this.clearPopupTimer(element);
    const { placement, hiddenScroll, top: targetTop, popupLimitSpacing } = this.props;

    if (hiddenScroll) {
      Modal.cacheOpenedIds.push(this.openId);
      const currentDocument = window.document.body;
      currentDocument.style.overflow = 'hidden';
      if (hasVerticalScrollbar(this.scrollBarSize)) {
        currentDocument.style.paddingRight = `${this.scrollBarSize}px`;
        if (element && element.parentNode) {
          const parentNode = element.parentNode as HTMLElement;
          parentNode.style.paddingRight = `${this.scrollBarSize}px`;
        }
      }
    }

    const { top, height } = getPopupLocation({
      placement,
      element,
      targetTop,
      popupLimitSpacing
    } as PopupLocationArgs);

    element.style.top = top;

    if (height) {
      element.style.height = height;
    }
  };

  onEntered = () => {
    const { onOpened, name } = this.props;
    if (onOpened) {
      onOpened(name);
    }
  };

  onExited = (element?: HTMLElement) => {
    const { hiddenScroll, onDestroy, name } = this.props;
    const currentDocument = window.document.body;
    if (hiddenScroll && currentDocument) {
      // 删除指定id
      Modal.cacheOpenedIds = Modal.cacheOpenedIds.filter(id => id !== this.openId);
      // 如果都隐藏了，才清除body样式
      if (Modal.cacheOpenedIds.length === 0) {
        currentDocument.style.overflow = '';
        currentDocument.style.paddingRight = '';
      }
    }
    if (element && element.parentNode) {
      const parentNode = element.parentNode as HTMLElement;
      parentNode.style.display = 'none';
      parentNode.style.paddingRight = '';
    }
    if (onDestroy) {
      onDestroy(name);
    }
  };

  renderPopup() {
    const cls = this.prefixCls;
    const {
      visible,
      children,
      width,
      height,
      className,
      closable,
      title,
      placement,
      top
    } = this.props;
    const maxHeight = `calc(100vh - .3rem - ${placement === 'top' && top ? top : '0px'})`;
    return (
      <div className={classNames(cls, className)}>
        <CSSTransition
          in={visible}
          timeout={300}
          classNames={`${cls}-fade`}
          onEnter={this.onEnter}
          onEntered={this.onEntered}
          onExited={this.onExited}
          appear
        >
          <div
            className={`${cls}-content`}
            style={{
              width: width,
              height: height,
              maxHeight: maxHeight
            }}
            ref={this.popupRef}
          >
            <Title prefixCls={cls} closable={closable} onClose={this.onClose} title={title} />
            {children}
          </div>
        </CSSTransition>
      </div>
    );
  }

  render() {
    const visible = this.props.visible;
    if (visible || this.popupRef.current) {
      return (
        <Portal>
          <React.Fragment>
            <Mask visible={visible} timeout={500} ref={this.maskRef} />
            {this.renderPopup()}
          </React.Fragment>
        </Portal>
      );
    }
    return null;
  }
}
