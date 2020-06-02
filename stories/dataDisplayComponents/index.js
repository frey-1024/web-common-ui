import React from 'react';
import { addNewStories } from '../utils';
import MoveDemo, { moveDoc } from './move';
import PopoverDemo, { popoverDoc } from './popover';
import DrawerDemo, { drawerDoc } from './drawer';
import ModalDemo, { modalDoc } from './modal';
import ConfirmDemo, { confirmDoc } from './confirm';
import CollapseDemo, { collapseDoc } from './collapse';
import CarouselDemo, { carouselDoc } from './carousel';
import ShowMoreDemo, { showMoreDoc } from './showMore';

addNewStories('数据展示型组件', [
  {
    name: 'Move',
    component: MoveDemo,
    doc: moveDoc,
    inline: false
  },
  {
    name: 'Popover',
    component: PopoverDemo,
    doc: popoverDoc
  },
  {
    name: 'Drawer',
    component: DrawerDemo,
    doc: drawerDoc,
    inline: false
  },
  {
    name: 'Modal',
    component: ModalDemo,
    doc: modalDoc,
    inline: false
  },
  {
    name: 'Confirm',
    component: ConfirmDemo,
    doc: confirmDoc,
    inline: false
  },
  {
    name: 'Collapse',
    component: CollapseDemo,
    doc: collapseDoc,
    inline: false
  },
  {
    name: 'Carousel',
    component: CarouselDemo,
    doc: carouselDoc,
    inline: false
  },
  {
    name: 'ShowMore',
    component: ShowMoreDemo,
    doc: showMoreDoc,
    inline: false
  }
]);
