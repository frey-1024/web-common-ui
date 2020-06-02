import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

export interface MaskProps {
  className?: string;
  visible: boolean;
  timeout?: number;
  onClose?: (event?: React.MouseEvent | React.TouchEvent) => void;
}
const prefixCls = 'ab-mask';

function Mask({ className, timeout = 300, onClose = () => {}, visible }: MaskProps, ref) {
  return (
    <CSSTransition in={visible} timeout={timeout} classNames={`${prefixCls}-fade`} appear>
      <div
        className={classNames(prefixCls, className)}
        onMouseDown={onClose}
        onTouchStart={onClose}
        ref={ref}
      />
    </CSSTransition>
  );
}

export default React.memo(React.forwardRef<HTMLElement, MaskProps>(Mask));
