import React from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';
import README from './README.md';
import Popover from 'src/popover/index.tsx';
import 'src/popover/style/index.js';
import './style.scss';

export default function PopoverDemo() {
  const [height, setHeight] = React.useState(false);
  setTimeout(() => {
    setHeight(true);
  }, 5000);
  return (
    <div className="popover-demo">
      <Popover
        tip={
          <div style={{ height: height ? '100px' : '32px' }}>
            {text('tip', '111111111111111111 333333')}
          </div>
        }
        trigger={select('trigger', ['click', 'hover', 'focus'], 'click')}
        placement={select(
          'placement',
          ['top', 'left', 'bottom', 'right', 'leftBottom', 'rightTop'],
          'right'
        )}
        hiddenClose={boolean('hiddenClose', false)}
        popupLimitSpacing={0}
      >
        <input defaultValue="Popover 展示区域" />
      </Popover>
    </div>
  );
}

export const popoverDoc = README;
