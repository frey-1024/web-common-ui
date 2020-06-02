import React from 'react';
import classNames from 'classnames';

function noop() {}

export interface CheckboxProps {
  children: React.ReactElement;
  className?: string;
  size?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => {};
}

interface CheckboxStates {
  checked: boolean;
}

export default class Checkbox extends React.Component<CheckboxProps, CheckboxStates> {
  static defaultProps = {
    className: '',
    size: 16,
    checked: false,
    defaultChecked: false,
    disabled: false,
    onChange: noop
  };

  prefixCls: string = 'ab-checkbox';

  constructor(props: CheckboxProps) {
    super(props);
    const { defaultChecked } = props;
    this.state = {
      checked: defaultChecked
    };
  }

  static getDerivedStateFromProps(nextProps: CheckboxProps) {
    if ('checked' in nextProps) {
      return { checked: nextProps.checked };
    }
    return null;
  }

  onChange = () => {
    if (this.props.disabled) {
      return;
    }
    const checked = !this.state.checked;
    if (!('checked' in this.props)) {
      this.setState({ checked });
    }
    const { onChange } = this.props;
    onChange(checked);
  };

  render() {
    const cls = this.prefixCls;
    const { className, disabled, children, size } = this.props;
    const { checked } = this.state;
    const innerStyle = { width: `${size}px`, height: `${size}px` };
    const iconStyle = { width: `${(size * 6) / 16}px`, height: `${(size * 10) / 16}px` };
    return (
      <label
        className={classNames(`${cls}-wrap`, className, {
          [`${cls}-checked`]: checked,
          [`${cls}-disabled`]: disabled
        })}
      >
        <span className={cls}>
          <input className={`${cls}-input`} type="checkbox" onClick={this.onChange} />
          <span className={`${cls}-inner`} style={innerStyle}>
            <span className={`${cls}-icon`} style={iconStyle} />
          </span>
        </span>
        <span className={`${cls}-content`}>{children}</span>
      </label>
    );
  }
}
