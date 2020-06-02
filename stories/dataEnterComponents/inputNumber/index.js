import React, { useState } from 'react';
import README from './README.md';
import InputNumber from 'src/input-number';
import 'src/input-number/style';
import './style.scss';
import { boolean, number } from '@storybook/addon-knobs';

export default function InputNumberDemo() {
  const [value, setValue] = useState('');
  const onChange = value => setValue(value);
  return (
    <div className="input-number-demo">
      <InputNumber
        value={value}
        onChange={onChange}
        min={number('min', 1)}
        max={number('max', 9999)}
        size={number('size', 4)}
        packMultiple={number('packMultiple', 5)}
        visibleButton={boolean('visibleButton', true)}
      />
    </div>
  );
}

export const inputNumberDoc = README;
