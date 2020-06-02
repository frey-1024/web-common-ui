import React from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import Portal from '../portal';
import UseConfig from '../use-config';
import { getOffset } from '../utils/get';
import Mask from '../mask';

export interface GuideProps {
  visible: boolean;
  onChangeVisible: (visible: boolean) => void;
  loadablePointer?: boolean;
  img?: string;
  position: 'left' | 'center' | 'right'; // 分别代表上左，上中，上右
  translateX?: number;
  translateY?: number;
  expires?: number;
}

interface GuideStates {
  top: string;
  left: string;
}

export default class Guide extends React.Component<GuideProps, GuideStates> {
  prefixCls = 'ab-guide';
  timer: any = null;
  imgRef = React.createRef<HTMLImageElement>();
  // 默认值
  static defaultProps = {
    loadablePointer: false,
    img: `${UseConfig.assetBaseUrl}/images/vehicle_pointer.png`,
    position: 'center',
    translateX: 0,
    translateY: 0,
    expires: 3000
  };
  getElement = () => findDOMNode(this);

  constructor(props: GuideProps) {
    super(props);
    this.state = {
      top: '0',
      left: '0'
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.changeVisible();
      this.positionPointer();
    }
  }

  componentDidUpdate(prevProps: GuideProps) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      this.changeVisible();
      this.positionPointer();
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  positionPointer() {
    const { loadablePointer, img, position, visible, translateX, translateY } = this.props;
    if (loadablePointer && visible) {
      const image = new Image();
      image.src = img;
      image.onload = () => {
        const element = this.getElement();
        if (element) {
          const { left, top, width } = getOffset(element as HTMLElement);
          const imgWidth = image.width;
          const imgHeight = image.height;
          const imgTop = `${top - imgHeight + translateY}px`;
          if (position === 'left') {
            this.setState({
              top: imgTop,
              left: `${left + translateX}px`
            });
            return;
          }
          if (position === 'right') {
            this.setState({
              top: imgTop,
              left: `${left + width - imgWidth + translateX}px`
            });
            return;
          }
          // 默认居中
          this.setState({
            top: imgTop,
            left: `${left + width / 2 - imgWidth / 2 + translateX}px`
          });
        }
      };
    }
  }

  changeVisible = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const { onChangeVisible, expires } = this.props;
    this.timer = setTimeout(() => {
      onChangeVisible(false);
    }, expires);
  };

  onClose = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.props.onChangeVisible(false);
  };

  renderMask() {
    const { visible, loadablePointer, img } = this.props;
    const { top, left } = this.state;
    const cls = this.prefixCls;
    const style = { left: left, top: top, display: visible ? 'block' : 'none' };
    if (visible || this.imgRef.current) {
      return (
        <Portal>
          <React.Fragment>
            <Mask
              className={`${cls}-mask`}
              visible={visible}
              timeout={400}
              onClose={this.onClose}
            />
            {loadablePointer ? (
              <img
                style={style}
                className={`${cls}-icon`}
                src={img}
                alt="selection pointer"
                ref={this.imgRef}
              />
            ) : null}
          </React.Fragment>
        </Portal>
      );
    }
    return null;
  }
  render() {
    const cls = this.prefixCls;
    const { children, visible } = this.props;
    const className = visible ? `${cls}-content` : null;
    if (typeof children === 'function') {
      return (
        <React.Fragment>
          {children({ className: className })}
          {this.renderMask()}
        </React.Fragment>
      );
    }
    const child = React.Children.only(children) as React.ReactElement;
    return (
      <React.Fragment>
        {React.cloneElement(child, {
          className: classNames(className, child.props.className)
        })}
        {this.renderMask()}
      </React.Fragment>
    );
  }
}
