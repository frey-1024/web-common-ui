import React from 'react';
import Script from '../index';
import { mount } from 'enzyme';

class ScriptDemo extends React.Component {
  render() {
    return <Script url="https://code.jquery.com/jquery-3.4.1.min.js" />;
  }
}

describe('Script', () => {
  it('执行顺序', () => {
    let count = 0;
    const beforeCode = 'const name = "paul"';
    const onCreate = jest.fn(() => {
      count = 10;
    });
    const onLoad = jest.fn(() => {
      count = 20;
    });

    const wrapper = mount(
      <Script
        url="https://code.jquery.com/jquery-3.4.1.min.js"
        beforeCode={beforeCode}
        onCreate={onCreate}
        onLoad={onLoad}
      />
    );
    wrapper.update();
    // const aa = wrapper.find('body');
    const bb = wrapper.find('Script');
    // expect(count).toBe(10);
  });
});
