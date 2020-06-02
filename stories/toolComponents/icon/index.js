import React from 'react';
import README from './README.md';
import Icon from 'src/icon';
import 'src/icon/style';
import './style.scss';
import { number, color, select } from '@storybook/addon-knobs';
import IconNames from './iconNames';

export default function IconDemo() {
  return (
    <ul className="demo-icon-list">
      {IconNames.map(name => (
        <li key={name}>
          <Icon
            name={name}
            width={number('width', 0.34, { step: 0.1 })}
            height={number('height', 0.34, { step: 0.1 })}
            color={color('color', '#000')}
            transform={select(
              'transform',
              ['', 'rotate(45deg)', 'translateX(.2rem)', 'scale(1.5)'],
              ''
            )}
          />
          <p className="demo-icon-name">{name}</p>
        </li>
      ))}
    </ul>
  );
}

export const iconNumberDoc = README;
