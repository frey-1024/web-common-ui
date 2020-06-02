import React from 'react';
import README from './README.md';
import LoadingContainer from 'src/loading-container';
import { boolean } from '@storybook/addon-knobs';
import './style.scss';

export default function LoadingContainerDemo() {
  return (
    <LoadingContainer className="loading-container-demo" loading={boolean('loading', true)}>
      <div>内容区域</div>
    </LoadingContainer>
  );
}

export const loadingContainerDoc = README;
