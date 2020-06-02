import React from 'react';
import { addNewStories } from '../utils';
import InputNumberDemo, { inputNumberDoc } from './inputNumber';
import SelectDemo, { selectDoc } from './select';

addNewStories('数据输入型组件', [
  {
    name: 'Select',
    component: SelectDemo,
    doc: selectDoc,
    inline: false
  },
  {
    name: 'InputNumber',
    component: InputNumberDemo,
    doc: inputNumberDoc
  }
]);
