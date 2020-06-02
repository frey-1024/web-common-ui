import React from 'react';
import LoadingContainer from '../index';
import { mount } from 'enzyme';

describe('LoadingContainer', () => {
  it('loading时显示svg', () => {
    const wrapper = mount(
      <LoadingContainer loading={true}>
        <div />
      </LoadingContainer>
    );
    expect(wrapper.find('.ab-loading-container-icon').length).toBeGreaterThan(0);
    expect(
      wrapper.find('.ab-loading-container').hasClass('ab-loading-container-active')
    ).toBeTruthy();
    wrapper.setProps({ loading: false });
    expect(wrapper.find('.ab-loading-container-icon').length).toBeLessThan(1);
    expect(
      wrapper.find('.ab-loading-container').hasClass('ab-loading-container-active')
    ).toBeFalsy();
  });
});
