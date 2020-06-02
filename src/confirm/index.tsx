import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { canUseDOM } from '../utils/string';
import Modal, { ModalProps } from '../modal';

export interface ConfirmProps extends Pick<ModalProps, Exclude<keyof ModalProps, 'visible'>> {
  content: React.ReactElement | string | number;
  hiddenCancel?: boolean;
  hiddenOk?: boolean;
  visible?: boolean;
  cancelText?: string;
  okText?: string;
  cancelClassName?: string;
  okClassName?: string;
  reverse?: false;
  onOk?: () => void;
  onCancel?: () => void;
}

const prefixCls = 'ab-confirm';

const defaultConfig = {
  hiddenCancel: false,
  hiddenOk: false,
  cancelText: 'Cancel',
  cancelClassName: `${prefixCls}-cancel`,
  okText: 'Confirm',
  okClassName: `${prefixCls}-ok`,
  reverse: false,
  content: 'Are you sure?',
  width: '3.6rem',
  placement: 'center',
  visible: true,
  onOk() {},
  onCancel() {}
} as ConfirmProps;

export default function Confirm(config: ConfirmProps) {
  if (!canUseDOM) {
    throw new Error('Confirm use client!');
  }
  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentConfig = defaultConfig;

  function updateCurrentConfig(config: ConfirmProps) {
    const cancelClassName = classNames(defaultConfig.cancelClassName, config.cancelClassName);
    const okClassName = classNames(defaultConfig.okClassName, config.okClassName);
    currentConfig = {
      ...defaultConfig,
      ...config,
      cancelClassName,
      okClassName,
      onDestroy: onDestroy
    };
  }

  updateCurrentConfig(config);

  function close(type) {
    currentConfig = {
      ...currentConfig,
      visible: false
    };
    render(currentConfig);
    if (type === 'ok') {
      currentConfig.onOk();
    } else {
      currentConfig.onCancel();
    }
  }

  function onDestroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function onVisible() {
    close('cancel');
  }
  function onConfirm() {
    close('ok');
  }

  function render(props) {
    ReactDOM.render(
      <Modal
        {...props}
        className={classNames(`${prefixCls}-wrap`, props.className)}
        visible={props.visible}
        onClose={onVisible}
      >
        {props.content}
        <div
          className={classNames([`${prefixCls}-btns`, { [`${prefixCls}-reverse`]: props.reverse }])}
        >
          {props.hiddenCancel ? null : (
            <button className={props.cancelClassName} onClick={onVisible}>
              {props.cancelText}
            </button>
          )}
          {props.hiddenOk ? null : (
            <button className={props.okClassName} onClick={onConfirm}>
              {props.okText}
            </button>
          )}
        </div>
      </Modal>,
      div
    );
  }

  // 渲染组件
  render(currentConfig);

  return {
    destroy: close,
    forceUpdate: (config: ConfirmProps) => {
      updateCurrentConfig(config);
      render(currentConfig);
    }
  };
}
