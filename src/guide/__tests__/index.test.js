import React from 'react';
import { mount } from 'enzyme';
import Guide from '../index';

class GuideDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  onOpen = () => {
    this.setState({ visible: true });
  };

  onChangeVisible = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;
    return (
      <div className="guide-demo">
        <Guide {...this.props} visible={visible} onChangeVisible={this.onChangeVisible}>
          <input className="input" placeholder="请输入" />
        </Guide>
        <button className="btn" onClick={this.onOpen}>
          提交
        </button>
      </div>
    );
  }
}

describe('Guide', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('通过传送门元素添加到document.body上', () => {
    const onChangeVisible = jest.fn();
    const wrapper = mount(
      <Guide visible={true} onChangeVisible={onChangeVisible}>
        <input />
      </Guide>
    );
    expect(
      wrapper.find('div.ab-guide-mask').instance().parentNode.parentNode instanceof HTMLBodyElement
    ).toBeTruthy();
    wrapper.unmount();
  });

  it('经过3秒自动隐藏 Guide, 给child添加类名', () => {
    const wrapper = mount(<GuideDemo />);
    expect(wrapper.find('.input').hasClass('ab-guide-content')).toBeFalsy();
    expect(wrapper.find('div.ab-guide-mask')).toHaveLength(0);
    wrapper.find('.btn').simulate('click');
    expect(wrapper.find('.input').hasClass('ab-guide-content')).toBeTruthy();
    expect(wrapper.find('div.ab-guide-mask')).toHaveLength(1);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.input').hasClass('ab-guide-content')).toBeFalsy();
    expect(wrapper.find('div.ab-guide-mask')).toHaveLength(0);
  });

  it('children为function', () => {
    const onChangeVisible = jest.fn();
    const children = function() {
      return <input />;
    };
    const wrapper = mount(
      <Guide visible={true} onChangeVisible={onChangeVisible} children={children} />
    );
    expect(wrapper.find('div.ab-guide-mask')).toHaveLength(1);
  });
});
