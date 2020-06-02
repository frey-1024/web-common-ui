import React from 'react';
import { boolean, number, select } from '@storybook/addon-knobs';
import README from './README.md';
import Move from 'src/move/index.tsx';
import 'src/move/style/index.js';
import './style.scss';

class MoveData extends React.Component {
  render() {
    return (
      <div className="demo-move">
        <Move {...this.props}>
          <img
            className="111"
            style={{ width: '1000px', height: '1000px' }}
            alt="111"
            src="https://apw.dev.autobestdevops.com/resources/encry/diagram/apw/large/eb18cc6837fbca49145ebeb131804647.png"
          />
        </Move>
      </div>
    );
  }
}

export default function MoveDemo() {
  return (
    <MoveData
      scalable={boolean('scalable', true)}
      monitorWindowResize={boolean('monitorWindowResize', true)}
      minScalable={number('minScalable', 1)}
      maxScalable={number('maxScalable', 2)}
      horizontalPlacement={select('horizontalPlacement', ['left', 'center', 'right'], 'left')}
      verticalPlacement={select('verticalPlacement', ['top', 'center', 'bottom'], 'top')}
    />
  );
}

export const moveDoc = README;
