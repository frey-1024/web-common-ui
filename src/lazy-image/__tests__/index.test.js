import { mount } from 'enzyme';
import LazyImage from '../index';
import React from 'react';
const cls = '.ab-lazy-image';
const loadingCls = '.ab-lazy-image-loading';
const src =
  'http://192.168.1.128:9099/resources/part-image/featured/Prime/small/Default/water-pump.jpg';

describe('LazyImage', () => {
  it('hover效果', () => {
    const onMouseOver = jest.fn();
    const onMouseOut = jest.fn();
    const wrapper = mount(
      <LazyImage
        src={src}
        alt="1111"
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        hoverOpacity={0.5}
      />
    );
    wrapper.find(cls).simulate('mouseover');
    expect(onMouseOver).toHaveBeenCalledTimes(1);
    wrapper.find(cls).simulate('mouseout');
    expect(onMouseOut).toHaveBeenCalledTimes(1);
  });

  it('设置了defaultImage，则没有loading', () => {
    const defaultImage = 'defaultImage.jpg';
    const wrapper = mount(<LazyImage src={src} alt="1111" defaultImage={defaultImage} />);
    expect(wrapper.find(cls).props().src).toBe(defaultImage);
    expect(wrapper.find(cls).hasClass('ab-lazy-image-loading')).toBeFalsy();
  });

  it('测试 loading', () => {
    document.body.width = '100px';
    document.body.height = '100px';
    const onLoading = jest.fn();
    const onLoaded = jest.fn();
    const onError = jest.fn();
    const errorImg = 'error.jpg';
    const wrapper = mount(
      <LazyImage src={src} alt="1111" onLoading={onLoading} onLoaded={onLoaded} onError={onError} />
    );
    expect(wrapper.find(loadingCls)).toHaveLength(1);

    // todo: 等待加载完成
    // expect(onLoading).toHaveBeenCalledTimes(1);
    // expect(onLoaded).toHaveBeenCalledTimes(1);
    // expect(wrapper.find(loadingCls)).toHaveLength(0);

    // wrapper.setProps({ src: errorImg });
    // wrapper.update();
    // expect(wrapper.find(loadingCls)).toHaveLength(1);

    // expect(wrapper.find(cls).props().src).toBe(errorImg);
    // expect(onLoading).toHaveBeenCalledTimes(2);
    // expect(onLoaded).toHaveBeenCalledTimes(10);
    // expect(onError).toHaveBeenCalledTimes(1);
    // expect(wrapper.find(loadingCls)).toHaveLength(0);
  });

  it('测试懒加载', () => {
    // todo: 模拟滚动
    const wrapper = mount(
      <div className="lazy-image-demo">
        {[...Array(10)].map((_item, index) => {
          return <LazyImage key={index} src={src} alt="1111" />;
        })}
      </div>
    );
  });
});
