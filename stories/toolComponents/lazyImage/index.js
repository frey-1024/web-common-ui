import React from 'react';
import README from './README.md';
import LazyImage from 'src/lazy-image';
import 'src/lazy-image/style';
import './style.scss';
import { number, text, boolean, select } from '@storybook/addon-knobs';

const src =
  'http://192.168.1.128:9099/resources/part-image/featured/Prime/small/Default/water-pump.jpg';

export default function LazyImageDemo() {
  return (
    <div className="lazy-image-demo">
      {[...Array(1)].map((item, index) => {
        return (
          <LazyImage
            key={index}
            src={select('src', [src, 'error.jpg'], src)}
            alt={text('alt', '1111')}
            hoverOpacity={number('hoverOpacity', 0.5, { step: 0.1, min: 0, max: 1 })}
            isMobile={boolean('isMobile', false)}
            active={boolean('active', true)}
          />
        );
      })}
    </div>
  );
}

export const lazyImageDoc = README;
