import React from 'react';
import { mount } from 'enzyme';
import Skeleton from '../index';

const Item = Skeleton.Item;

class SkeletonDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1000);
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="skeleton-demo">
        <Skeleton
          loading={loading}
          rows={3}
          content={<Item style={{ width: '3rem', height: '.2rem', marginBottom: '.1rem' }} />}
        >
          <div className="data-demo">内容区域</div>
        </Skeleton>
      </div>
    );
  }
}

describe('Skeleton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loading结束显示children', () => {
    const wrapper = mount(<SkeletonDemo />);
    expect(wrapper.find('.ab-skeleton-item')).toHaveLength(3);
    expect(wrapper.find('.data-demo')).toHaveLength(0);
    expect(wrapper.find('Skeleton').prop('loading')).toBeTruthy();
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ab-skeleton-item')).toHaveLength(0);
    expect(wrapper.find('.data-demo')).toHaveLength(1);
    expect(wrapper.find('Skeleton').prop('loading')).toBeFalsy();
  });
});
