import React from 'react';
import Portal from '../portal';
import { hasVerticalScrollbar } from '../utils/string';
import { getScrollBarSize } from '../utils/getScrollBarSize';
import Mask from '../mask';
import Child, { ChildBaseProps } from './Child';

export interface DrawerProps extends ChildBaseProps {
  name?: string;
  maskClosable?: boolean;
  hiddenScroll?: boolean;
  keyboard?: boolean;
  showMask?: boolean;
  onClose?: (v: boolean, n?: string) => void;
  onDestroy?: (n?: string) => void;
}

export default class Drawer extends React.Component<DrawerProps> {
  prefixCls = 'ab-drawer';
  // 默认值
  static defaultProps = {
    placement: 'left',
    width: '2.45rem',
    height: '2.45rem',
    closable: true,
    showMask: true,
    maskClosable: true,
    hiddenScroll: true,
    keyboard: true
  };
  childRef = React.createRef<HTMLDivElement>();

  componentWillUnmount() {
    // 销毁时，如果没有执行onExited，则在此执行
    this.onExited();
  }
  onClose = () => {
    const { maskClosable, onClose, name } = this.props;
    if (maskClosable && onClose) {
      onClose(false, name);
    }
  };

  onCancel = () => {
    const { onClose, name } = this.props;
    if (onClose) {
      onClose(false, name);
    }
  };
  // 用于标志是否弹出，在关闭时，防止重复关闭
  isEnter = false;
  onEnter = () => {
    this.isEnter = true;
    const currentDocument = window.document.body;
    const { hiddenScroll } = this.props;
    if (hiddenScroll) {
      currentDocument.style.overflow = 'hidden';
      const scrollSize = getScrollBarSize();
      if (hasVerticalScrollbar(scrollSize)) {
        currentDocument.style.paddingRight = `${scrollSize}px`;
      }
    }
  };
  onExited = () => {
    if (!this.isEnter) {
      return;
    }
    const currentDocument = window.document.body;
    const { hiddenScroll } = this.props;
    if (hiddenScroll && currentDocument) {
      currentDocument.style.overflow = '';
      currentDocument.style.paddingRight = '';
    }
    const { onDestroy, name } = this.props;
    if (onDestroy) {
      onDestroy(name);
    }
  };

  render() {
    const { visible, children, showMask, ...extraProps } = this.props;
    if (visible || this.childRef.current) {
      return (
        <Portal>
          <React.Fragment>
            {showMask ? <Mask onClose={this.onClose} visible={visible} timeout={300} /> : null}
            <Child
              {...extraProps}
              visible={visible}
              children={children}
              prefixCls={this.prefixCls}
              onCancel={this.onCancel}
              onEnter={this.onEnter}
              onExited={this.onExited}
              ref={this.childRef}
            />
          </React.Fragment>
        </Portal>
      );
    }
    return null;
  }
}
