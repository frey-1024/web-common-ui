import React from 'react';
import { boolean, text, number } from '@storybook/addon-knobs';
import README from './README.md';
import ShowMore from 'src/show-more';
import 'src/show-more/style';
import './style.scss';

export default function ShowMoreDemo() {
  return (
    <div className="show-more-demo">
      <ShowMore
        lines={number('lines', 2)}
        ellipsisText={text('ellipsisText', 'Show More')}
        width={number('width', 200)}
        expandable={boolean('expandable', true)}
      >
        Acura is the luxury vehicle marque of Japanese automaker Honda. The brand was launched in
        the United States and Canada in March 1986, marketing luxury, performance, and
        high-performance vehicles. The first two vehicles Acura offered initially are the Legend, a
        sporty luxury sedan, and the Integra, a more economical three-door or five-door hatchback.
      </ShowMore>
    </div>
  );
}

export const showMoreDoc = README;
