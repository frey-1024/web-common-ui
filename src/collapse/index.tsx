import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

export interface CollapseProps {
  defaultVisible?: boolean;
  visible?: boolean;
  title?: React.ReactNode;
  name?: string;
  appear?: boolean;
  mountOnEnter?: boolean;
  className?: string;
  onChange?: (v: boolean, n?: string) => any;
  onEntered?: (v: HTMLElement, n?: string) => any;
  onExited?: (v: HTMLElement, n?: string) => any;
}

export interface CollapseStates {
  visible: boolean;
}

export default class Collapse extends React.Component<CollapseProps, CollapseStates> {
  readonly prefixCls = 'ab-collapse';
  cacheHeight: string;
  // 默认值
  static defaultProps = {
    defaultVisible: false,
    appear: true,
    mountOnEnter: false
  };
  constructor(props: CollapseProps) {
    super(props);
    this.state = {
      visible: props.defaultVisible
    };
  }
  static getDerivedStateFromProps(nextProps: CollapseProps) {
    if ('visible' in nextProps) {
      return { visible: nextProps.visible };
    }
    return null;
  }
  onEnter = (el: HTMLElement) => {
    this.cacheHeight = `${el.offsetHeight}px`;
    el.style.height = '0px';
  };
  onEntering = (el: HTMLElement) => {
    el.style.height = this.cacheHeight;
  };
  onEntered = (el: HTMLElement) => {
    el.style.height = '';
    if (this.props.onEntered) {
      this.props.onEntered(el, this.props.name);
    }
  };
  onExit = (el: HTMLElement) => {
    el.style.height = this.cacheHeight || `${el.offsetHeight}px`;
  };
  onExiting = (el: HTMLElement) => {
    el.style.height = '0px';
  };
  onExited = (el: HTMLElement) => {
    el.style.height = '';
    if (this.props.onExited) {
      this.props.onExited(el, this.props.name);
    }
  };
  onChange = () => {
    const visible = !this.state.visible;
    if (!('visible' in this.props)) {
      this.setState({ visible });
    }
    const { onChange, name } = this.props;
    if (onChange) {
      onChange(visible, name);
    }
  };
  renderTitle() {
    const { title } = this.props;
    if (!title) {
      return null;
    }
    const child = React.Children.only(title) as React.ReactElement;
    return React.cloneElement(child, {
      onClick: child.props.onClick || this.onChange
    });
  }
  /**
   * @returns {*}
   */
  renderContent() {
    const { children, className, appear, mountOnEnter } = this.props;
    const { visible } = this.state;
    const cls = this.prefixCls;
    return (
      <CSSTransition
        in={visible}
        timeout={200}
        classNames={`${cls}-fade`}
        onEnter={this.onEnter}
        onEntering={this.onEntering}
        onEntered={this.onEntered}
        onExit={this.onExit}
        onExiting={this.onExiting}
        onExited={this.onExited}
        appear={appear}
        mountOnEnter={mountOnEnter}
      >
        <div className={classNames(cls, className, { [`${cls}-hidden`]: appear && !visible })}>
          <div className={`${cls}-content`}>{children}</div>
        </div>
      </CSSTransition>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTitle()}
        {this.renderContent()}
      </React.Fragment>
    );
  }
}
