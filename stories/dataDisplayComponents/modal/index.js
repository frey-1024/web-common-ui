import React from 'react';
import README from './README.md';
import Modal from 'src/modal/index.tsx';
import Move from 'src/move/index.tsx';
import Drawer from 'src/drawer/index.tsx';
import 'src/modal/style/index.js';
import 'src/move/style/index.js';
import 'src/drawer/style/index.js';
import './style.scss';
import { boolean, select, text } from '@storybook/addon-knobs';

class ModalData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  onOpen = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <div className="modal-demo">
        <button onClick={this.onOpen}>打开Modal</button>
        <Modal {...this.props} placement="top" top="60px" visible={visible} onClose={this.onClose}>
          <Move>
            <div style={{ backgroundColor: '#0fcc40', width: '100px', height: '100px' }}>
              modal content
            </div>
          </Move>
        </Modal>
        <Drawer
          showMask={false}
          visible={visible}
          placement="bottom"
          height="1.4rem"
          onClose={this.onClose}
        >
          drawer content
        </Drawer>
      </div>
    );
  }
}

export default function ModalDemo() {
  return (
    <ModalData
      placement={select('placement', ['center', 'top'], 'center')}
      top={text('top', '0.45rem')}
      width={text('width', '3.45rem')}
      height={text('height', '3.45rem')}
      closable={boolean('closable', true)}
      hiddenScroll={boolean('hiddenScroll', true)}
      maskClosable={boolean('hiddenScroll', true)}
    />
  );
}

export const modalDoc = README;
