import React from 'react';
import README from './README.md';
import Guide from 'src/guide';
import 'src/guide/style';
import './style.scss';
import { number, boolean, select } from '@storybook/addon-knobs';

class GuideData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  onOpen = () => {
    this.setState({ visible: true });
  };

  onChangeVisible = visible => {
    this.setState({ visible });
  };

  componentDidMount() {
    // storybook 根节点下div自带z-index=0
    document.querySelector('.guide-demo').parentNode.style.zIndex = 'unset';
  }

  render() {
    const { visible } = this.state;
    return (
      <div className="guide-demo">
        <Guide {...this.props} visible={visible} onChangeVisible={this.onChangeVisible}>
          <input className="input" placeholder="请输入" />
        </Guide>
        <button className="btn" onClick={this.onOpen}>
          提交
        </button>
      </div>
    );
  }
}

export default function GuideDemo() {
  return (
    <GuideData
      loadablePointer={boolean('loadablePointer', true)}
      position={select('position', ['left', 'center', 'right'], 'center')}
      translateX={number('translateX', 0)}
      translateY={number('translateY', 0)}
      expires={number('expires', 3000)}
    />
  );
}

export const guideDoc = README;
