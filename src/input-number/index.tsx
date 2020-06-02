import React from 'react';
import classNames from 'classnames';
import { isBlank } from '../utils/string';
import debounce from '../utils/debounce';
import { findDOMNode } from 'react-dom';
import { getOffset } from '../utils/get';
import addEventListener, { ListenerEventHandler } from '../utils/addEventListener';

interface OnchangeHandler {
  (value: string, name?: string): void;
}

interface ChangeEvent {
  target: {
    value: string | number;
  };
}

export interface InputNumberProps {
  onChange: OnchangeHandler;
  className?: string;
  value?: string | number;
  min?: number;
  max?: number;
  packMultiple?: number;
  disabled?: boolean;
  isPositive?: boolean;
  size?: number;
  name?: string;
  delay?: number;
  onChangePackMultipleBefore?: OnchangeHandler;
  onChangePackMultipleAfter?: OnchangeHandler;
  visibleButton?: boolean;
}

interface InputNumberStates {
  enter: boolean;
  focus: boolean;
}

interface DebounceRef {
  (value: string): void;
  cancel: () => void;
}

interface LocationInfo {
  left: number;
  top: number;
  width: number;
  height: number;
}

const cls: string = 'ab-input-number';

class InputNumber extends React.Component<InputNumberProps, InputNumberStates> {
  static defaultProps = {
    value: '',
    name: '',
    size: 3,
    disabled: false,
    isPositive: true,
    delay: 1000,
    visibleButton: false
  };

  constructor(props: InputNumberProps) {
    super(props);
    this.state = {
      enter: false,
      focus: false
    };
  }

  debounce: DebounceRef;
  addLocationInfo: LocationInfo;
  subLocationInfo: LocationInfo;
  mouseUpHandler: ListenerEventHandler;
  mouseMoveHandler: ListenerEventHandler;

  componentDidMount(): void {
    this.addMouseMoveListener();
  }

  componentWillUnmount(): void {
    if (this.mouseUpHandler) {
      this.mouseUpHandler.remove();
      this.mouseUpHandler = null;
    }
    if (this.mouseMoveHandler) {
      this.mouseMoveHandler.remove();
      this.mouseMoveHandler = null;
    }
  }

  onFocus = () => {
    if (!this.props.visibleButton) {
      return;
    }
    this.setState({ focus: true });
  };
  onBlur = () => {
    if (!this.props.visibleButton) {
      return;
    }
    this.setState({ focus: false });
  };

  onMouseEnter = () => {
    if (!this.props.visibleButton) {
      return;
    }
    this.setState({ enter: true }, () => {
      this.getLocationInfo();
    });
  };

  onMouseLeave = () => {
    if (!this.props.visibleButton) {
      return;
    }
    this.setState({ enter: false });
  };

  onMouseMove = (ev: React.MouseEvent) => {
    if (!this.props.visibleButton) {
      return;
    }
    const { inputEl, addBtnEl, subBtnEl } = this.getElement();
    if (!inputEl || !addBtnEl || !subBtnEl) {
      return;
    }
    const { isAdd, isSub } = this.getMouseElement(ev);
    if (isAdd) {
      inputEl.style.cursor = 'default';
      addBtnEl.setAttribute('class', `${cls}-button ${cls}-hover`);
      return;
    }
    if (isSub) {
      inputEl.style.cursor = 'default';
      subBtnEl.setAttribute('class', `${cls}-button ${cls}-hover`);
      return;
    }
    inputEl.style.cursor = 'text';
    addBtnEl.setAttribute('class', `${cls}-button`);
    subBtnEl.setAttribute('class', `${cls}-button`);
  };

  onMouseDown = (ev: React.MouseEvent) => {
    if (!this.props.visibleButton) {
      return;
    }
    const { addBtnEl, subBtnEl } = this.getElement();
    if (!addBtnEl || !subBtnEl) {
      return;
    }
    // 按下时清除move事件
    this.mouseMoveHandler.remove();
    const { isAdd, isSub } = this.getMouseElement(ev);
    if (isAdd) {
      addBtnEl.setAttribute('class', `${cls}-button ${cls}-active`);
      this.onAdd();
    }
    if (isSub) {
      subBtnEl.setAttribute('class', `${cls}-button ${cls}-active`);
      this.onSub();
    }
    this.addMouseUpListener();
  };

  onMouseUp = () => {
    this.mouseUpHandler.remove();
    const { addBtnEl, subBtnEl } = this.getElement();
    if (addBtnEl && subBtnEl) {
      addBtnEl.setAttribute('class', `${cls}-button`);
      subBtnEl.setAttribute('class', `${cls}-button`);
    }
    // 重新添加move事件
    this.addMouseMoveListener();
  };

  addMouseMoveListener = () => {
    const { inputEl } = this.getElement();
    this.mouseMoveHandler = addEventListener(inputEl, 'mousemove', this.onMouseMove);
  };

  addMouseUpListener = () => {
    this.mouseUpHandler = addEventListener(window.document, 'mouseup', this.onMouseUp);
  };

  getElement = () => {
    const element = findDOMNode(this);
    let inputEl: HTMLInputElement,
      buttonEl: HTMLDivElement,
      addBtnEl: HTMLDivElement,
      subBtnEl: HTMLDivElement;
    if (element && element.childNodes.length) {
      inputEl = element.childNodes[0] as HTMLInputElement;
    }
    if (element && element.childNodes.length > 1) {
      buttonEl = element.childNodes[1] as HTMLDivElement;
      addBtnEl = buttonEl.children[0] as HTMLDivElement;
      subBtnEl = buttonEl.children[1] as HTMLDivElement;
    }
    return { inputEl, addBtnEl, subBtnEl };
  };

  //判断鼠标是否在按钮位置，在哪个按钮
  getMouseElement = ev => {
    const isAdd = this.isInside(ev, this.addLocationInfo);
    const isSub = this.isInside(ev, this.subLocationInfo);
    return { isAdd, isSub };
  };

  isInside = (ev, locationInfo) => {
    const { pageX, pageY } = ev;
    const { left, top, width, height } = locationInfo;
    return pageX > left && pageX < left + width && pageY > top && pageY < top + height;
  };

  getLocationInfo = () => {
    const { addBtnEl, subBtnEl } = this.getElement();
    if (!addBtnEl || !subBtnEl) {
      return;
    }
    this.addLocationInfo = getOffset(addBtnEl);
    this.subLocationInfo = getOffset(subBtnEl);
  };

  // 不需要根据props的value更新
  getCurrentValue = value => {
    const { min, max, packMultiple } = this.props;
    const valueNumber = parseFloat(value);
    // 取大于等于值且是打包个数倍数的值
    const ceilNumber = Math.ceil(valueNumber / packMultiple) * packMultiple;
    // 当值在临界点和临界点之外时
    if (ceilNumber <= min) {
      return Math.ceil(min / packMultiple) * packMultiple;
    }
    if (ceilNumber >= max) {
      return Math.floor(max / packMultiple) * packMultiple;
    }
    return ceilNumber;
  };

  onChangePackMultipleValue = (value: string) => {
    const currentValue = this.getCurrentValue(value).toString();
    const { onChange, onChangePackMultipleAfter, name } = this.props;
    onChange(currentValue, name);
    if (onChangePackMultipleAfter) {
      onChangePackMultipleAfter(currentValue, name);
    }
  };

  getDebounce = () => {
    if (this.debounce) {
      return this.debounce;
    }
    this.debounce = debounce(this.onChangePackMultipleValue, this.props.delay);
    return this.debounce;
  };

  callBack = (value: string) => {
    const {
      packMultiple,
      name,
      onChange,
      onChangePackMultipleBefore,
      onChangePackMultipleAfter
    } = this.props;
    if (onChange) {
      onChange(value, name);
    }
    const valueNumber = parseFloat(value);
    if (!isBlank(packMultiple) && !isBlank(value) && valueNumber % packMultiple !== 0) {
      if (onChangePackMultipleBefore) {
        onChangePackMultipleBefore(value, name);
      }
      this.getDebounce()(value);
      return;
    }
    // 清除没有执行的防抖函数
    if (this.debounce) {
      this.debounce.cancel();
      this.debounce = null;
      if (onChangePackMultipleAfter) {
        onChangePackMultipleAfter(value, name);
      }
    }
  };

  onValueChange = (ev: ChangeEvent) => {
    const { min, max, isPositive, value } = this.props;
    const currentValue = ev.target.value.toString();
    if (isBlank(currentValue)) {
      this.callBack('');
      return;
    }
    const preValue = value.toString();
    const reg = /^-$|(^(-?\d+)(\.\d*)?)$/;
    if (!reg.test(currentValue)) {
      this.callBack(preValue);
      return;
    }
    // 0开头后面直接是数字，没有点如：011， 这是不合法的
    const zeroReg = /^0\d+$/;
    if (zeroReg.test(currentValue)) {
      this.callBack(preValue);
      return;
    }
    const valueNumber = parseFloat(currentValue);
    if (!isBlank(min)) {
      if (min > valueNumber) {
        this.callBack(preValue);
        return;
      }
      // 如果min>= 0, 将阻止输入-
      if (min >= 0 && currentValue.indexOf('-') > -1) {
        this.callBack('');
        return;
      }
    }
    if (!isBlank(max) && max < valueNumber) {
      this.callBack(preValue);
      return;
    }
    if (isPositive && currentValue.indexOf('.') > -1) {
      this.callBack(preValue);
      return;
    }
    this.callBack(currentValue);
  };

  onAdd = () => {
    const { packMultiple, value } = this.props;
    const step = packMultiple || 1;
    // valueNumber 可能为NaN
    const ev = { target: { value: (parseFloat(value.toString()) || 0) + step } };
    this.onValueChange(ev);
  };

  onSub = () => {
    const { packMultiple, value } = this.props;
    const step = packMultiple || 1;
    const ev = { target: { value: (parseFloat(value.toString()) || 0) - step } };
    this.onValueChange(ev);
  };

  // 渲染加减按钮
  renderButton = () => {
    return (
      <div className={`${cls}-button-wrap`}>
        <div className={`${cls}-button`} onClick={this.onAdd}>
          <div className={`${cls}-add`} />
        </div>
        <div className={`${cls}-button`} onClick={this.onSub}>
          <div className={`${cls}-sub`} />
        </div>
      </div>
    );
  };

  render() {
    const copyProps = { ...this.props };
    delete copyProps.onChangePackMultipleBefore;
    delete copyProps.onChangePackMultipleAfter;
    delete copyProps.isPositive;
    delete copyProps.packMultiple;
    delete copyProps.visibleButton;
    const { className, visibleButton } = this.props;
    const { enter, focus } = this.state;
    const inputStyle = visibleButton ? { paddingRight: '.2rem' } : {};
    return (
      <label className={`${cls}-wrap`}>
        <input
          {...copyProps}
          className={classNames(cls, className)}
          type="text"
          onChange={this.onValueChange}
          onMouseDown={this.onMouseDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          style={inputStyle}
        />
        {visibleButton && (enter || focus) ? this.renderButton() : null}
      </label>
    );
  }
}

export default InputNumber;
