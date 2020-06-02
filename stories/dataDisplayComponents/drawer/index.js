import React from 'react';
import README from './README.md';
import Drawer from 'src/drawer/index.tsx';
import 'src/drawer/style/index.js';
import './style.scss';
import { boolean, select, text } from '@storybook/addon-knobs';

class DrawerData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  onChange = () => {
    this.setState({
      visible: !this.state.visible
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <div className="drawer-demo">
        <button onClick={this.onChange}>打开Drawer</button>
        <Drawer {...this.props} visible={visible} onClose={this.onChange}>
          <div>11111</div>
        </Drawer>
      </div>
    );
  }
}

export default function DrawerDemo() {
  return (
    <DrawerData
      placement={select('placement', ['left', 'top', 'right', 'bottom'], 'left')}
      width={text('width', '2.45rem')}
      height={text('height', '2.45rem')}
      closable={boolean('closable', true)}
      hiddenScroll={boolean('hiddenScroll', true)}
    />
  );
}

export const drawerDoc = README;
