import 'intersection-observer';
import React, { MouseEventHandler, MouseEvent } from 'react';
import UseConfig from '../use-config';
import classNames from 'classnames';

export interface LazyImageProps {
  src: string;
  alt: string;
  defaultImage?: string; // 未加载到图片时的占位图
  title?: string;
  className?: string;
  hoverOpacity?: number;
  isMobile?: boolean;
  active?: boolean; // loading的动态效果
  onClick?: MouseEventHandler<HTMLImageElement>;
  onMouseOver?: MouseEventHandler<HTMLImageElement>;
  onMouseOut?: MouseEventHandler<HTMLImageElement>;
  onLoading?: (src: string) => void;
  onLoaded?: (src: string) => void;
  onError?: () => void;
}

interface LazyImageStates {
  hoverOpacity: boolean | null;
  loading: boolean;
}

interface IntersectionObserverImageEntry extends IntersectionObserverEntry {
  target: HTMLImageElement;
}

export default class LazyImage extends React.Component<LazyImageProps, LazyImageStates> {
  static defaultProps = {
    className: '',
    defaultImage: '',
    hoverOpacity: null,
    isMobile: false,
    active: true
  };
  prefixCls: string = 'ab-lazy-image';
  rootRef = React.createRef<HTMLImageElement>();

  constructor(props: LazyImageProps) {
    super(props);
    this.state = {
      hoverOpacity: null,
      loading: !props.defaultImage
    };
  }
  observerImg() {
    const props = this.props;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(item => {
          const imgItem = item as IntersectionObserverImageEntry;
          if (imgItem.isIntersecting) {
            io.unobserve(imgItem.target);
            imgItem.target.src = imgItem.target.dataset.src;
            if (props.onLoading) {
              props.onLoading(imgItem.target.src);
            }
            imgItem.target.onload = () => {
              if (!props.defaultImage) {
                this.setState({ loading: false });
              }
              if (props.onLoaded) {
                props.onLoaded(imgItem.target.src);
              }
              imgItem.target.onload = null;
            };
            imgItem.target.onerror = () => {
              if (!props.defaultImage) {
                this.setState({ loading: false });
              }
              if (props.onError) {
                props.onError();
              }
              imgItem.target.onerror = null;
            };
          }
        });
      },
      {
        rootMargin: '10px 0px 10px 0px'
      }
    );
    io.observe(this.rootRef.current);
  }
  componentDidMount() {
    this.observerImg();
  }
  componentDidUpdate(prevProps: LazyImageProps) {
    if (prevProps.src !== this.props.src) {
      this.rootRef.current.setAttribute(
        'src',
        this.props.defaultImage || `${UseConfig.assetBaseUrl}/svg/empty.svg`
      );
      if (!this.props.defaultImage) {
        this.setState({ loading: true });
      }
      this.observerImg();
    }
  }
  onMouseOut = (ev: MouseEvent<HTMLImageElement>) => {
    if (this.props.isMobile) {
      return;
    }
    const { hoverOpacity, onMouseOut } = this.props;
    const el = ev.target as HTMLImageElement;
    if (hoverOpacity) {
      el.style.opacity = '1';
    }
    if (onMouseOut) {
      onMouseOut(ev);
    }
  };
  onMouseOver = (ev: MouseEvent<HTMLImageElement>) => {
    if (this.props.isMobile) {
      return;
    }
    const { hoverOpacity, onMouseOver } = this.props;
    const el = ev.target as HTMLImageElement;
    if (hoverOpacity) {
      el.style.opacity = hoverOpacity.toString();
    }
    if (onMouseOver) {
      onMouseOver(ev);
    }
  };

  render() {
    const cls = this.prefixCls;
    const { className, defaultImage, src, active } = this.props;
    const { loading } = this.state;
    const props = { ...this.props };
    delete props.src;
    delete props.defaultImage;
    delete props.className;
    delete props.onMouseOver;
    delete props.onMouseOut;
    delete props.hoverOpacity;
    delete props.isMobile;
    delete props.active;
    delete props.onLoading;
    delete props.onLoaded;
    return (
      <img
        alt=""
        {...props}
        className={classNames(cls, className, {
          [`${cls}-loading`]: loading,
          [`${cls}-active`]: loading && active
        })}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        src={defaultImage || `${UseConfig.assetBaseUrl}/svg/empty.svg`}
        data-src={src}
        ref={this.rootRef}
      />
    );
  }
}
