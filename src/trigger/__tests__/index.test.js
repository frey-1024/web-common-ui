import React from 'react';
import { mount } from 'enzyme';
import Trigger from '../index';

function trigger(wrapper, event = 'click') {
  wrapper
    .find('Trigger > *')
    .first()
    .simulate(event, null);
  jest.runAllTimers();
  wrapper.update();
}

describe('Trigger', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('通过传送门元素添加到document.body上', () => {
    const wrapper = mount(
      <Trigger trigger="click" placement="left" popup={<strong>trigger text</strong>}>
        <div className="target">click</div>
      </Trigger>
    );
    trigger(wrapper);
    const popupDomNode = wrapper.instance().getPopupDomNode();
    expect(popupDomNode.parentNode.parentNode instanceof HTMLBodyElement).toBeTruthy();
  });

  it('trigger绑定click事件, 能够弹框', () => {
    const wrapper = mount(
      <Trigger trigger="click" placement="left" popup={<strong>trigger text</strong>}>
        <div className="target">click</div>
      </Trigger>
    );

    trigger(wrapper);
    expect(wrapper.find('.ab-trigger-wrap').text()).toBe('trigger text');
  });

  it('trigger绑定hover事件, 显示与隐藏', () => {
    const wrapper = mount(
      <Trigger trigger="hover" placement="left" popup={<strong>trigger text</strong>}>
        <div className="target">click</div>
      </Trigger>
    );
    trigger(wrapper, 'mouseEnter');
    expect(wrapper.find('CSSTransition').prop('in')).toBeTruthy();
    trigger(wrapper, 'mouseLeave');
    expect(wrapper.find('CSSTransition').prop('in')).toBeFalsy();
  });

  it('外部控制trigger显示与隐藏', () => {
    let currentVisible = false;

    class Demo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          visible: currentVisible
        };
      }
      onVisibleChange = () => {
        currentVisible = !this.state.visible;
        this.setState({
          visible: currentVisible
        });
      };
      render() {
        return (
          <Trigger
            visible={this.state.visible}
            trigger="click"
            placement="leftBottom"
            popup={<strong>trigger</strong>}
          >
            <div onClick={this.onVisibleChange}>click</div>
          </Trigger>
        );
      }
    }
    const wrapper = mount(<Demo />);
    expect(currentVisible).toBeFalsy();
    trigger(wrapper);
    expect(currentVisible).toBeTruthy();
    trigger(wrapper);
    expect(currentVisible).toBeFalsy();
    wrapper.unmount();
  });

  it('弹框嵌套弹框，点击字弹框内容，父级弹框和子弹框不会隐藏', () => {
    let innerVisible = null;
    function onInnerPopupVisibleChange(value) {
      innerVisible = value;
    }
    const innerTrigger = (
      <Trigger
        onVisibleChange={onInnerPopupVisibleChange}
        placement="top"
        trigger="click"
        popup={<div id="child-popup">Final Popup</div>}
      >
        <div id="child-trigger">another trigger in popup</div>
      </Trigger>
    );

    let visible = null;
    function onPopupVisibleChange(value) {
      visible = value;
    }
    const wrapper = mount(
      <Trigger
        onVisibleChange={onPopupVisibleChange}
        placement="right"
        trigger="click"
        popup={innerTrigger}
      >
        <span className="target">basic trigger</span>
      </Trigger>
    );

    // Basic click
    wrapper.find('.target').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    expect(visible).toBeTruthy();
    expect(innerVisible).toBeFalsy();

    wrapper.find('#child-trigger').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    expect(visible).toBeTruthy();
    expect(innerVisible).toBeTruthy();

    wrapper.find('#child-popup').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    expect(visible).toBeTruthy();
    expect(innerVisible).toBeTruthy();
  });
});
