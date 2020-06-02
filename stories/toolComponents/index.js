import React from 'react';
import { addNewStories } from '../utils';
import IconDemo, { iconNumberDoc } from './icon';
import { SkeletonDemo, SkeletonItemDemo, skeletonDoc } from './skeleton';
import ScriptDemo, { scriptDoc } from './script';
import LazyImageDemo, { lazyImageDoc } from './lazyImage';
import GuideDemo, { guideDoc } from './guide';
import LoadingContainerDemo, { loadingContainerDoc } from './loadingContainer';
import LoadingBarDemo, { loadingBarDoc } from './loadingBar';
import LoadingDemo, { loadingDoc } from './loading';

addNewStories('工具型组件', [
  {
    name: 'Icon',
    component: IconDemo,
    doc: iconNumberDoc
  },
  {
    name: 'Skeleton',
    component: SkeletonDemo,
    doc: skeletonDoc
  },
  {
    name: 'Skeleton.Item',
    component: SkeletonItemDemo,
    doc: skeletonDoc
  },
  {
    name: 'Script',
    component: ScriptDemo,
    doc: scriptDoc
  },
  {
    name: 'LazyImage',
    component: LazyImageDemo,
    doc: lazyImageDoc
  },
  {
    name: 'Guide',
    component: GuideDemo,
    doc: guideDoc
  },
  {
    name: 'LoadingContainer',
    component: LoadingContainerDemo,
    doc: loadingContainerDoc
  },
  {
    name: 'LoadingBar',
    component: LoadingBarDemo,
    doc: loadingBarDoc
  },
  {
    name: 'Loading',
    component: LoadingDemo,
    doc: loadingDoc
  }
]);
