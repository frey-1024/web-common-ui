import React from 'react';
import README from './README.md';
import Confirm from 'src/confirm/index';
import 'src/confirm/style/index.js';
import './style.scss';
import { boolean, select, text } from '@storybook/addon-knobs';

class ConfirmData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }
  renderContent = () => {
    return <strong>Delete this address {this.state.visible ? '未刷新' : '已刷新'}</strong>;
  };
  onOpen = () => {
    this.confirm = Confirm({
      ...this.props,
      okText: 'Delete',
      cancelText: 'Cancel',
      content: this.renderContent(),
      onOk: () => {
        alert('Delete');
      },
      onCancel: () => {
        alert('Cancel');
      }
    });
    setTimeout(() => {
      this.setState(
        {
          visible: !this.state.visible
        },
        () => {
          this.confirm.forceUpdate({ content: this.renderContent() });
        }
      );
    }, 1000);
  };
  render() {
    return (
      <div className="confirm-demo">
        <button onClick={this.onOpen}>
          打开按钮(数据的更新需要关闭重新打开， 或者使用强制刷新)
        </button>
      </div>
    );
  }
}

export default function ConfirmDemo() {
  return (
    <ConfirmData
      placement={select('placement', ['center', 'top'], 'center')}
      okText={text('okText', 'OK')}
      cancelText={text('cancelText', 'Cancel')}
      hiddenOk={boolean('hiddenOk', false)}
      hiddenCancel={boolean('hiddenCancel', false)}
      width={text('width', '2.45rem')}
      height={text('height', '')}
      closable={boolean('closable', true)}
      hiddenScroll={boolean('hiddenScroll', true)}
      maskClosable={boolean('hiddenScroll', true)}
    />
  );
}

export const confirmDoc = README;
