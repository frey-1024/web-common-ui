import React from 'react';
import classNames from 'classnames';
import Transition from './transition';
import { getElementSize } from '../utils/get';
import { isTouchScreen } from '../utils/string';
import addEventListener, { ListenerEventHandler } from '../utils/addEventListener';
import throttleWithRAF from '../utils/throttleWithRAF';

export interface CarouselProps {
  children: Array<React.ReactElement> | React.ReactElement;
  defaultValue?: number;
  className?: string;
  autoplay?: boolean;
  delay?: number;
  // 敏感值，设置多少后可以进行切换
  sensitivity?: number;
  height?: string;
  // 开启渐变， 默认是scroll-x
  fadeEffect?: boolean;
  // 是否可以手动控制
  controllable?: boolean;
  monitorWindowResize?: boolean;
  onClick?: (page: number) => void;
  onBeforeChange?: (page: number) => void;
  onAfterChange?: (page: number) => void;
  pagination?: React.ReactNode | ((instance: React.ReactInstance) => React.ReactNode);
}

interface CarouselStates {
  currentPage: number;
  initialized: boolean;
}

export default class Carousel extends React.Component<CarouselProps, CarouselStates> {
  readonly prefixCls = 'ab-carousel';
  wrapWidth: number = 0;
  startX: number = 0;
  prevX: number = 0;
  moveX: number = 0;
  currentX: number = 0;
  isDirectionLeft: boolean = true;

  sliderRef = React.createRef<HTMLDivElement>();

  autoplayTimer = null;
  fadeEffectTimer = null;
  // 默认值
  static defaultProps = {
    defaultValue: 1,
    className: '',
    sensitivity: 30,
    autoplay: false,
    delay: 3000,
    height: '',
    controllable: true,
    fadeEffect: false,
    monitorWindowResize: true
  };

  resizeHandler: ListenerEventHandler | null;

  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.defaultValue,
      initialized: false
    };
  }

  componentDidMount() {
    this.setState({
      initialized: true
    });
    this.init();
  }

  componentDidUpdate(prevProps: CarouselProps) {
    const { children } = this.props;

    if (React.Children.count(children) !== React.Children.count(prevProps.children)) {
      this.init();
    }
    // 加入 resize 监听
    if (this.props.monitorWindowResize && !this.resizeHandler) {
      this.resizeHandler = addEventListener(window, 'resize', throttleWithRAF(() => this.init()));
    }
  }
  componentWillUnmount() {
    clearTimeout(this.autoplayTimer);
    clearTimeout(this.fadeEffectTimer);
    if (this.resizeHandler) {
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  }

  getChildCount = () => React.Children.count(this.props.children);

  getTrackWidth = () => this.wrapWidth * this.getChildCount();

  init = (sliderEl?: HTMLDivElement) => {
    const element = sliderEl || this.getSliderDomNode();
    const { currentPage } = this.state;
    const length = this.getChildCount();
    const { width } = getElementSize(element.parentNode as HTMLElement);
    this.wrapWidth = width;

    const childList = Array.from(element.children);
    childList.forEach((child: any) => {
      child.style.width = `${width}px`;
    });

    element.style.width = `${width * length}px`;
    this.prevX = -(currentPage - 1) * width;
    this.onBeforeChange(currentPage);
    this.setTrackStyles(element, this.prevX);
    this.onAutoplay();
  };

  getSliderDomNode = () => {
    if (this.sliderRef && this.sliderRef.current) {
      return this.sliderRef.current;
    }
    return null;
  };

  setTrackStyles = (element: HTMLElement, translateX: number, transition?: string) => {
    element.style.transition = '';
    if (this.props.fadeEffect) {
      clearTimeout(this.fadeEffectTimer);
      element.style.visibility = 'none';
      element.style.opacity = '0';
      this.fadeEffectTimer = setTimeout(() => {
        element.style.transition = Transition.Opacity;
        element.style.opacity = '1';
        element.style.visibility = '';
      });
    } else {
      element.style.transition = transition || Transition.TransformEaseInOut;
    }
    element.style.transform = `translateX(${translateX}px)`;
  };

  changeSlide = (nextPage: number, transition?: string) => {
    clearTimeout(this.autoplayTimer);

    const childLength = React.Children.count(this.props.children);
    if (nextPage > childLength) {
      nextPage = 1;
    } else if (nextPage < 1) {
      nextPage = childLength;
    }

    const sliderEl = this.getSliderDomNode();
    if (sliderEl && this.wrapWidth) {
      this.prevX = -(nextPage - 1) * this.wrapWidth;
      this.onBeforeChange(nextPage);
      this.setTrackStyles(sliderEl, this.prevX, transition);
    }

    this.setState(
      {
        currentPage: nextPage
      },
      () => {
        this.onAutoplay();
      }
    );
  };

  onAutoplay() {
    if (!this.props.autoplay || this.getChildCount() <= 1) {
      return;
    }
    clearTimeout(this.autoplayTimer);
    this.autoplayTimer = setTimeout(() => {
      this.changeSlide(this.state.currentPage + 1);
    }, this.props.delay);
  }

  public next = (transition?: string) => {
    this.changeSlide(this.state.currentPage + 1, transition);
  };
  public prev = (transition?: string) => {
    this.changeSlide(this.state.currentPage - 1, transition);
  };
  public goTo = (nextIndex: number, transition?: string) => {
    this.changeSlide(nextIndex, transition);
  };

  onBeforeChange = (currentPage: number) => {
    if (typeof this.props.onBeforeChange === 'function') {
      this.props.onBeforeChange(currentPage);
    }
  };

  onAfterChange = () => {
    if (typeof this.props.onAfterChange === 'function') {
      this.props.onAfterChange(this.state.currentPage);
    }
  };

  onClick = () => {
    if (isTouchScreen()) {
      return null;
    }
    if (this.props.onClick) {
      this.props.onClick(this.state.currentPage);
    }
  };
  onSwipeStart = event => {
    if (!this.props.controllable || this.props.fadeEffect) {
      return;
    }
    event.preventDefault();
    clearTimeout(this.autoplayTimer);
    this.currentX = 0;
    this.startX = event.touches ? event.touches[0].pageX : event.clientX;
    const sliderEl = this.getSliderDomNode();
    sliderEl.style.transition = 'none';
  };

  onSwipeMove = event => {
    if (!this.props.controllable || this.props.fadeEffect) {
      return;
    }
    event.preventDefault();
    this.currentX = event.touches ? event.touches[0].pageX : event.clientX;
    this.moveX = this.prevX + this.currentX - this.startX;
    this.isDirectionLeft = this.prevX - this.startX <= this.prevX - this.currentX;
    const sliderEl = this.getSliderDomNode();
    sliderEl.style.transform = `translateX(${this.moveX}px)`;
  };

  onSwipeEnd = event => {
    const { onClick, controllable, fadeEffect, sensitivity } = this.props;
    if (!controllable || fadeEffect) {
      if (onClick) {
        onClick(this.state.currentPage);
      }
      return;
    }

    if (this.currentX === 0 || Math.abs(this.startX - this.currentX) < sensitivity) {
      if (onClick) {
        onClick(this.state.currentPage);
      }
    }
    const transition = Transition.TransformEaseOut;
    event.preventDefault();
    if (this.moveX >= 0) {
      this.goTo(1, transition);
      return;
    }
    const trackWidth = this.getTrackWidth();
    const moveX = Math.abs(this.moveX);
    if (moveX >= trackWidth - this.wrapWidth) {
      this.goTo(this.getChildCount(), transition);
      return;
    }

    let currentPage = this.state.currentPage;
    const skipOne = moveX % this.wrapWidth >= this.props.sensitivity ? 1 : 0;
    const skipCount = Math.floor(Math.abs(moveX - Math.abs(this.prevX)) / this.wrapWidth);

    if (this.isDirectionLeft) {
      currentPage = currentPage + skipCount + skipOne;
    } else {
      currentPage = currentPage - (skipCount + skipOne);
    }
    this.goTo(currentPage, transition);
  };

  render() {
    const cls = this.prefixCls;
    const { className, children, pagination } = this.props;
    return (
      <div className={classNames(cls, className, { [`${cls}-init`]: this.state.initialized })}>
        <div className={`${cls}-list`}>
          <div
            style={{ height: this.props.height }}
            className={`${cls}-track`}
            ref={this.sliderRef}
            onTouchStart={this.onSwipeStart}
            onTouchMove={this.onSwipeMove}
            onTouchEnd={this.onSwipeEnd}
            onClick={this.onClick}
            onTransitionEnd={this.onAfterChange}
          >
            {React.Children.map(children, (child, index) => {
              return (
                <div key={index} className={`${cls}-slider`}>
                  {child}
                </div>
              );
            })}
          </div>
        </div>
        {typeof pagination === 'function' ? pagination(this) : pagination}
      </div>
    );
  }
}
