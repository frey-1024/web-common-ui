import React from 'react';
import classNames from 'classnames';
import AccordionItem, { AccordionItemProps, BaseAccordionItemProps } from './Item';

export interface AccordionProps {
  children: React.ReactElement | Array<React.ReactElement>;
  className?: string;
  interactive?: boolean;
  beforeVisibleChange?: (key?: string) => boolean;
  onVisibleChange?: (key?: string, visible?: boolean) => void;
  defaultVisibleKeys?: Array<string>;
}

export interface AccordionStates {
  visibleKeys: Array<string>;
}

export default class Accordion extends React.Component<AccordionProps, AccordionStates> {
  readonly prefixCls = 'ab-accordion';
  // 限制用户传入的参数，所以用BaseAccordionItemProps
  static Item = AccordionItem as React.ComponentType<BaseAccordionItemProps>;

  constructor(props) {
    super(props);

    this.state = {
      visibleKeys: props.defaultVisibleKeys as Array<string>
    };
  }

  static defaultProps = {
    className: '',
    interactive: true,
    defaultVisibleKeys: []
  };

  /***
   * 展开下拉链接列表
   * @param keyValue
   */
  onVisibleChange = (keyValue: string) => {
    const { interactive, beforeVisibleChange, onVisibleChange } = this.props;

    if (beforeVisibleChange) {
      if (!beforeVisibleChange(keyValue)) {
        return;
      }
    }

    const { visibleKeys } = this.state;
    const isCurVisible = visibleKeys.includes(keyValue);
    if (interactive) {
      // 能同时展开多项，只对当前项做展开/闭合操作
      this.setState({
        visibleKeys: isCurVisible
          ? visibleKeys.filter(value => value !== keyValue)
          : [...visibleKeys, keyValue]
      });
    } else {
      // 每次只能展开一项
      this.setState({ visibleKeys: isCurVisible ? [] : [keyValue] });
    }

    if (onVisibleChange) {
      onVisibleChange(keyValue, !isCurVisible);
    }
  };

  render() {
    const cls = this.prefixCls;
    const { className, children } = this.props;
    const { visibleKeys } = this.state;
    return (
      <ul className={classNames(cls, className)}>
        {React.Children.map(children, (child: React.ReactElement<AccordionItemProps>) => {
          const key = child.props.keyValue;
          return React.cloneElement(child, {
            key: key,
            onTitleClick: () => {
              this.onVisibleChange(key);
            },
            visible: visibleKeys.includes(key)
          });
        })}
      </ul>
    );
  }
}
