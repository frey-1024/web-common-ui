import React from 'react';
import { mount } from 'enzyme';
import Icon from '../index';

describe('Icon', () => {
  it('设置最大最小宽高', () => {
    const wrapper = mount(
      <Icon name="angle" width={1} height={1} color="#000" transform="rotate(90deg)" />
    );
    const style = wrapper.find('ReactSVG').prop('style');
    // const beforeInjection = jest.spyOn(wrapper.find('ReactSVG').props(), 'beforeInjection');
    // expect(beforeInjection).toHaveBeenCalledTimes(1);
    expect(style).toEqual({
      width: '1rem',
      minWidth: '1rem',
      maxWidth: '1rem',
      height: '1rem',
      minHeight: '1rem',
      maxHeight: '1rem'
    });
  });

  it('设置点击效果', () => {
    const onClick = jest.fn();
    const wrapper = mount(<Icon name="angle" onClick={onClick} />);
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
