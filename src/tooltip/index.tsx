import React from 'react';
import Popover, { PopoverProps } from '../popover';

const cls = 'ab-tooltip';

export default function Tooltip(props: PopoverProps) {
  return (
    <Popover {...props} prefixCls={cls}>
      {props.children}
    </Popover>
  );
}
