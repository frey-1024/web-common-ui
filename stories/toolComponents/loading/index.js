import React from 'react';
import { boolean, number } from '@storybook/addon-knobs';
import README from './README.md';
import Loading from 'src/loading';
import 'src/loading/style';
import './style.scss';

class LoadingData extends React.Component {
  demoAjax = async () => {
    Loading.open(this.props);
    await new Promise(resolve =>
      setTimeout(() => {
        resolve('ok');
      }, 5000)
    );
    Loading.close();
  };

  render() {
    return (
      <div className="loading-demo">
        <button onClick={this.demoAjax}>点击 Loading 5s</button>
      </div>
    );
  }
}

export default function LoadingDemo() {
  return (
    <LoadingData isRectLoading={boolean('isRectLoading', false)} expire={number('expire', 0)} />
  );
}

export const loadingDoc = README;
