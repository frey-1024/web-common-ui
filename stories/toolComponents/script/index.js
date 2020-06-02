import React, { useState } from 'react';
import README from './README.md';
import Script from 'src/script';
import { select, object } from '@storybook/addon-knobs';
import './style.scss';

export default function ScriptDemo() {
  const [create, setCreate] = useState('');
  const [load, setLoad] = useState('');
  const [error, setError] = useState('');
  const onCreate = () => {
    setCreate('创建了、、、');
    setLoad('');
    setError('');
  };
  const onLoad = () => {
    setLoad('成功了、、、');
    setError('');
  };
  const onError = () => {
    setLoad('');
    setError('失败了、、、');
  };
  return (
    <div className="script-demo">
      <div>创建情况：{create}</div>
      <div>成功情况：{load}</div>
      <div>失败情况：{error}</div>
      <Script
        url={select(
          'url',
          [
            'https://code.jquery.com/jquery-3.4.1.min.js',
            'https://underscorejs.bootcss.com/underscore-min.js',
            'error.js'
          ],
          'https://underscorejs.bootcss.com/underscore-min.js'
        )}
        attributes={object('attributes', { async: false })}
        beforeCode={select('beforeCode', ['console.log(123)', 'alert(123)'], 'console.log(123)')}
        onCreate={onCreate}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}

export const scriptDoc = README;
