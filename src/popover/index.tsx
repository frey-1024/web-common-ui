import React from 'react';
import classNames from 'classnames';
import Trigger, { TriggerProps, ArrowStyleProps } from '../trigger';

const prefixCls = 'ab-popover';

export interface PopoverProps
  extends Pick<TriggerProps, Exclude<keyof TriggerProps, 'popup' | 'onArrowStyleChange'>> {
  tip: React.ReactNode;
  closeIcon?: React.ReactElement;
  prefixCls?: string;
  hiddenClose?: boolean;
}

function Popover(props: PopoverProps) {
  const triggerEl = React.useRef(null);
  const [arrowStyle, setState] = React.useState({});
  const cls = props.prefixCls || prefixCls;
  const onHidePopup = () => {
    if (triggerEl.current && triggerEl.current.hidePopup) {
      triggerEl.current.hidePopup();
    }
  };
  const onArrowStyleChange = (value: ArrowStyleProps) => {
    setState(value);
  };

  const { hiddenClose, closeIcon, closeClassName, innerClassName, tip, arrowClassName } = props;

  function renderClose() {
    if (hiddenClose) {
      return null;
    }
    // 当有自定义的icon时，直接使用,样式需要完全自定义
    if (closeIcon) {
      return React.cloneElement(closeIcon, {
        onClick: onHidePopup
      });
    }
    return (
      <i className={classNames(`${cls}-close`, closeClassName)} onClick={onHidePopup}>
        &times;
      </i>
    );
  }

  const innerClass = classNames(`${cls}-inner`, innerClassName, {
    [`${cls}-inner-expand`]: !hiddenClose
  });

  function renderPopup() {
    return (
      <React.Fragment>
        {renderClose()}
        <i className={classNames(`${cls}-arrow`, arrowClassName)} style={arrowStyle} />
        <div className={innerClass}>{tip}</div>
      </React.Fragment>
    );
  }

  return (
    <Trigger
      {...props}
      wrapClassName={classNames(`${cls}-wrap `, props.wrapClassName)}
      ref={triggerEl}
      hiddenArrow={false}
      popup={renderPopup}
      onArrowStyleChange={onArrowStyleChange}
    >
      {props.children}
    </Trigger>
  );
}

Popover.defaultProps = {
  hiddenClose: true
};

export default Popover;
