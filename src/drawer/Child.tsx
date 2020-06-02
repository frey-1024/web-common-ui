import React from 'react';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';

type ContentStyle = {
  width: string;
  height: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

type EnterOrExitStyle = {
  transform: string;
};

export interface ChildBaseProps {
  children: React.ReactElement | Array<React.ReactElement>;
  visible: boolean;
  placement: 'left' | 'top' | 'right' | 'bottom';
  closable?: boolean;
  width?: string;
  height?: string;
  className?: string;
}

interface ChildProps extends ChildBaseProps {
  prefixCls: string;
  onEnter: (e: any) => void;
  onExited: (e: any) => void;
  onCancel: (e: any) => void;
}

function Child(
  {
    prefixCls: cls,
    visible,
    children,
    width,
    height,
    className,
    placement,
    closable,
    onEnter,
    onExited,
    onCancel
  }: ChildProps,
  ref
) {
  const enterStyle: EnterOrExitStyle = {
    transform: 'translate(0, 0)'
  };
  const exitStyle: EnterOrExitStyle = {
    transform: ''
  };
  const contentStyle = {
    [placement]: '0px'
  } as ContentStyle;

  if (placement === 'left' || placement === 'right') {
    contentStyle.width = width;
    contentStyle.height = '100%';
    contentStyle.top = '0px';
    exitStyle.transform = `translate(${placement === 'right' ? width : `-${width}`}, 0)`;
  } else if (placement === 'top' || placement === 'bottom') {
    contentStyle.width = '100%';
    contentStyle.height = height;
    contentStyle.left = '0px';
    exitStyle.transform = `translate(0, ${placement === 'bottom' ? height : `-${height}`})`;
  }

  const transitionStyles = {
    entering: enterStyle,
    entered: enterStyle,
    exiting: exitStyle,
    exited: exitStyle
  };
  return (
    <Transition in={visible} timeout={200} appear onEnter={onEnter} onExited={onExited}>
      {state => (
        <div
          style={{
            ...contentStyle,
            ...transitionStyles[state]
          }}
          ref={ref}
          className={classNames(cls, className)}
        >
          {closable ? (
            <span className={`${cls}-times`} onClick={onCancel}>
              &times;
            </span>
          ) : null}

          {children}
        </div>
      )}
    </Transition>
  );
}

export default React.forwardRef<HTMLDivElement, ChildProps>(Child);
