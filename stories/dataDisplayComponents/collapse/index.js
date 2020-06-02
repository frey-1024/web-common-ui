import React from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';
import README from './README.md';
import Collapse from 'src/collapse/index.tsx';
import 'src/collapse/style/index.js';
import './style.scss';

class CollapseData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: []
    };
  }

  onVisibleChange = visible => {
    this.setState({
      visible
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <div className="demo-collapse">
        <Collapse
          {...this.props}
          title={<strong>点击此处</strong>}
          visible={visible}
          onChange={this.onVisibleChange}
        >
          1折叠的内容区域
          <br />
          2折叠的内容区域
          <br />
          3折叠的内容区域
          <br />
          4折叠的内容区域
        </Collapse>
      </div>
    );
  }
}

export default function CollapseDemo() {
  return (
    <CollapseData appear={boolean('appear', true)} mountOnEnter={boolean('mountOnEnter', false)} />
  );
}

export const collapseDoc = README;
