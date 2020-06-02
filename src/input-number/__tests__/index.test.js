import React, { useState } from 'react';
import { mount } from 'enzyme';
import InputNumber from '../index';

function InputNumberDemo(props) {
  const [value, setValue] = useState('');
  const onChange = value => setValue(value);
  return <InputNumber onChange={onChange} value={value} {...props} />;
}

// class InputNumberDemo extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { value: '' };
//   }
//   onChange = value => this.setState({ value });
//   render() {
//     return <InputNumber onChange={this.onChange} value={this.state.value} {...this.props} />;
//   }
// }

// 等待回调执行完成
function changeValue(wrapper, value, event = 'change') {
  wrapper.find('.ab-input-number').simulate(event, { target: { value } });
  jest.runAllTimers();
  wrapper.update();
}

function clickAddBtn(wrapper) {
  wrapper.find('.ab-input-number').simulate('focus');
  wrapper.find('.ab-input-number-add').simulate('click');
  jest.runAllTimers();
  wrapper.update();
}

function clickSubBtn(wrapper) {
  wrapper.find('.ab-input-number').simulate('focus');
  wrapper.find('.ab-input-number-sub').simulate('click');
  jest.runAllTimers();
  wrapper.update();
}

describe('InputNumber', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('输入非打包个数的倍数时，会向上取倍数, 且不越界', () => {
    const wrapper = mount(<InputNumberDemo packMultiple={5} min={5} max={99} />);
    changeValue(wrapper, 3);
    expect(wrapper.find('.ab-input-number').props().value).toBe('');

    changeValue(wrapper, 17);
    expect(wrapper.find('.ab-input-number').props().value).toBe('20');

    changeValue(wrapper, 98);
    expect(wrapper.find('.ab-input-number').props().value).toBe('95');
  });

  it('测试递增递减按钮', () => {
    const wrapper = mount(<InputNumberDemo visibleButton={true} />);
    clickAddBtn(wrapper);
    clickAddBtn(wrapper);
    expect(wrapper.find('.ab-input-number').props().value).toBe('2');
    clickSubBtn(wrapper);
    expect(wrapper.find('.ab-input-number').props().value).toBe('1');

    const multiWrapper = mount(<InputNumberDemo packMultiple={5} visibleButton={true} />);
    changeValue(multiWrapper, 3);
    expect(multiWrapper.find('.ab-input-number').props().value).toBe('5');
    clickAddBtn(multiWrapper);
    expect(multiWrapper.find('.ab-input-number').props().value).toBe('10');
  });

  it('消除非法输入', () => {
    const wrapper = mount(<InputNumberDemo min={5} max={100} packMultiple={5} isPositive={true} />);

    changeValue(wrapper, 'abc');
    expect(wrapper.find('.ab-input-number').props().value).toBe('');

    changeValue(wrapper, 3);
    expect(wrapper.find('.ab-input-number').props().value).toBe('');

    changeValue(wrapper, 300);
    expect(wrapper.find('.ab-input-number').props().value).toBe('');

    changeValue(wrapper, '011');
    expect(wrapper.find('.ab-input-number').props().value).toBe('');

    changeValue(wrapper, '-');
    expect(wrapper.find('.ab-input-number').props().value).toBe('');

    changeValue(wrapper, 5.2);
    expect(wrapper.find('.ab-input-number').props().value).toBe('');
  });

  it('测试回调函数', () => {
    const name = 'inputDemo';
    const onChange = jest.fn();
    const onChangeBefore = jest.fn();
    const onChangeAfter = jest.fn();
    const wrapper = mount(
      <InputNumber
        packMultiple={5}
        name={name}
        onChange={onChange}
        onChangePackMultipleBefore={onChangeBefore}
        onChangePackMultipleAfter={onChangeAfter}
      />
    );
    wrapper.find('.ab-input-number').simulate('change', { target: { value: 37 } });
    expect(onChange).toHaveBeenLastCalledWith('37', name);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChangeBefore).toHaveBeenLastCalledWith('37', name);
    jest.runAllTimers();
    wrapper.update();
    expect(onChange).toHaveBeenLastCalledWith('40', name);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChangeAfter).toHaveBeenLastCalledWith('40', name);
  });

  it('测试防抖', () => {
    const onChange = jest.fn();
    const onChangeBefore = jest.fn();
    const onChangeAfter = jest.fn();
    const wrapper = mount(
      <InputNumber
        onChange={onChange}
        packMultiple={5}
        onChangePackMultipleBefore={onChangeBefore}
        onChangePackMultipleAfter={onChangeAfter}
      />
    );
    wrapper.find('.ab-input-number').simulate('change', { target: { value: 7 } });
    expect(onChange).toHaveBeenCalledTimes(1);
    wrapper.find('.ab-input-number').simulate('change', { target: { value: 10 } });
    jest.runAllTimers();
    wrapper.update();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChangeBefore).toHaveBeenCalledTimes(1);
    expect(onChangeAfter).toHaveBeenCalledTimes(1);
  });
});
