import React, { ReactElement } from 'react';
import classNames from 'classnames';
import Trigger from '../trigger';
import { isBlank } from '../utils/string';

type Value = string | number | null;

export interface ItemProps {
  actualName: Value;
  name: Value;
  value: Value;
  disabled?: boolean;
  unselect?: boolean;
  className?: string;
}

export interface SelectProps {
  options: ItemProps[];
  value: Value;
  onChange: (item: ItemProps, name?: string) => void;
  name?: string;
  disabled?: boolean;
  columnCount?: number;
  placement?: string;
  className?: string;
  dropClassName?: string;
  placeholder?: string;
  hiddenIcon?: boolean;
  stopSpread?: boolean;
  isMinRootWidth?: boolean;
  maxHeight?: number;
  title?: ReactElement;
  bottom?: ReactElement;
  icon?: React.ReactNode | (() => React.ReactNode);
}

interface SelectStates {
  visible: boolean;
  list: [ItemProps[]];
}

export default class Select extends React.Component<SelectProps, SelectStates> {
  prefixCls: string = 'ab-select';
  // 默认值
  static defaultProps = {
    title: null,
    icon: (
      <svg
        viewBox="64 64 896 896"
        data-icon="down"
        fill="currentColor"
        width="1em"
        height="1em"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
      </svg>
    ),
    placeholder: 'Please select',
    columnCount: 1,
    maxHeight: 310,
    placement: 'bottomLeft',
    disabled: false,
    stopSpread: false,
    hiddenIcon: false,
    isMinRootWidth: false
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [[]]
    };
  }
  static getDerivedStateFromProps(nextProps: SelectProps) {
    const { columnCount, options } = nextProps;
    if (columnCount <= 1) {
      return {
        list: [[...options]]
      };
    }
    // 对columnCount值，进行分列，返回一个新的多维数组
    const list = [];
    const maxRow = Math.ceil(options.length / columnCount);
    // 分列
    for (let i = 1; i <= columnCount; i++) {
      const startIndex = maxRow * (i - 1);
      const endIndex = maxRow * i;
      const columnList = options.slice(startIndex, endIndex);
      list.push([...columnList]);
    }
    return {
      list
    };
  }
  /**
   * 设置显示与隐藏
   */
  triggerSelect = (status: boolean = false) => {
    if (this.state.visible === status) {
      return;
    }
    this.setState({
      visible: status
    });
  };

  onTriggerSelect = () => {
    if (this.props.disabled) {
      return;
    }
    this.triggerSelect(!this.state.visible);
  };

  onSelecting(ev: React.MouseEvent | React.TouchEvent, item) {
    if (ev) {
      ev.stopPropagation();
    }
    const { onChange, value, name } = this.props;
    if (item.value !== value) {
      onChange(item, name);
    }
    this.triggerSelect(false);
  }

  renderTitle() {
    const { title } = this.props;
    if (!title) {
      return null;
    }
    const child = React.Children.only(title);
    return React.cloneElement(child, {
      className: classNames(`${this.prefixCls}-title`, child.props.className)
    });
  }

  renderBottom() {
    const { bottom } = this.props;
    if (!bottom) {
      return null;
    }
    const child = React.Children.only(bottom);
    return React.cloneElement(child, {
      className: classNames(`${this.prefixCls}-bottom`, child.props.className)
    });
  }
  /**
   * 下拉框内容
   */
  getSelectPopup() {
    const cls = this.prefixCls;
    return (
      <React.Fragment>
        {this.renderTitle()}
        <div className={`${cls}-content`}>
          {this.state.list.map((col, index) => (
            <ul className={`${cls}-col`} key={index}>
              {col.map(item => {
                if (item.unselect) {
                  return (
                    <li
                      key={`${item.value}1`}
                      className={classNames(item.className, `${cls}-unselect`)}
                    >
                      {item.name}
                    </li>
                  );
                }
                return (
                  <li
                    key={item.value}
                    className={classNames(item.className, {
                      [`${cls}-active`]: item.value === this.props.value
                    })}
                    onClick={ev => this.onSelecting(ev, item)}
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
        {this.renderBottom()}
      </React.Fragment>
    );
  }

  /**
   * 根据value获取当前的name,并显示出来
   * @returns {*}
   */
  getCurrentName() {
    const { options, value } = this.props;
    if (!isBlank(value)) {
      const currentItem = options.find(item => item.value === value);
      if (currentItem) {
        return currentItem.actualName || currentItem.name;
      }
    }
    return null;
  }

  render() {
    const { visible } = this.state;
    const {
      className,
      placeholder,
      disabled,
      hiddenIcon,
      icon,
      dropClassName,
      ...extraProps
    } = this.props;

    const cls = this.prefixCls;
    const currentName = this.getCurrentName();

    return (
      <Trigger
        {...extraProps}
        wrapClassName={classNames(`${cls}-wrap`, dropClassName)}
        visible={visible}
        trigger="click"
        isTransformHorizontalDirection
        rootToPopupSpacing={0}
        popupLimitSpacing={0}
        popup={this.getSelectPopup()}
        onVisibleChange={this.triggerSelect}
      >
        <div
          className={classNames([
            `${cls}-input-group`,
            className,
            {
              [`${cls}-active`]: visible,
              disabled: disabled
            }
          ])}
          onClick={this.onTriggerSelect}
        >
          <div
            className={classNames([
              `${cls}-input-control`,
              { [`${cls}-focused`]: visible, [`${cls}-empty`]: !currentName }
            ])}
          >
            {currentName ? currentName : placeholder}
          </div>
          {hiddenIcon ? null : (
            <span className={`${cls}-icon`}>{typeof icon === 'function' ? icon() : icon}</span>
          )}
        </div>
      </Trigger>
    );
  }
}
