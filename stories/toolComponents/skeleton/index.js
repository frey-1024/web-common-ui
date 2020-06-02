import React from 'react';
import README from './README.md';
import Skeleton from 'src/skeleton';
import 'src/skeleton/style/';
import './style.scss';
import { number, boolean, object } from '@storybook/addon-knobs';

const Item = Skeleton.Item;

export function SkeletonDemo() {
  return (
    <div className="skeleton-demo">
      <Skeleton
        loading={boolean('loading', true)}
        active={boolean('active', true)}
        rows={number('row', 3)}
        content={<Item style={{ width: '3rem', height: '.2rem', marginBottom: '.1rem' }} />}
      >
        内容区域
        <br />
        内容区域
        <br />
        内容区域
      </Skeleton>
    </div>
  );
}

export function SkeletonItemDemo() {
  return (
    <div className="skeleton-demo">
      <Item style={object('style', { width: '3rem', height: '.2rem', marginBottom: '.1rem' })} />
    </div>
  );
}

export const skeletonDoc = README;
