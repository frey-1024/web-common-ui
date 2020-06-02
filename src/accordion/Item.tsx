import React from 'react';
import Collapse, { CollapseProps } from '../collapse';

/**
 * 暴露给用户的接口，用于接收来自用户输入的参数
 */
export interface BaseAccordionItemProps extends Pick<CollapseProps, 'title' | 'appear'> {
  children: React.ReactElement | Array<React.ReactElement>;
  keyValue: string;
}

/**
 * 父组件传进来的值，不需要用户传入
 */
export interface AccordionItemProps extends BaseAccordionItemProps, Pick<CollapseProps, 'visible'> {
  onTitleClick?: () => void;
}

export default class AccordionItem extends React.Component<AccordionItemProps, null> {
  getTitle = () => {
    const { title, onTitleClick } = this.props;
    if (!title) {
      return null;
    }
    const child = React.Children.only(title) as React.ReactElement;
    return React.cloneElement(child, {
      onClick: onTitleClick
    });
  };

  render() {
    const { appear, children, visible } = this.props;
    return (
      <li>
        <Collapse title={this.getTitle()} visible={visible} appear={appear}>
          {children}
        </Collapse>
      </li>
    );
  }
}
