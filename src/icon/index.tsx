import React from 'react';
import classNames from 'classnames';
import ReactSVG from 'react-svg';
import UseConfig from '../use-config';

interface SpanStyle {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface IconProps {
  name: string;
  assetBaseUrl?: string;
  wrapper?: 'span' | 'div';
  width?: number;
  height?: number;
  color?: string;
  transform?: string;
  className?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onTouchStart?: () => void;
}

const cls: string = 'ab-icon';

const Icon = (props: IconProps, ref: any) => {
  const {
    name,
    assetBaseUrl,
    wrapper = 'span',
    className,
    color,
    width,
    height,
    transform,
    onClick,
    onMouseDown,
    onTouchStart
  } = props;
  const baseUrl = assetBaseUrl || UseConfig.assetBaseUrl;
  const spanStyle: SpanStyle = {};
  if (width) {
    spanStyle.width = `${width}rem`;
    spanStyle.minWidth = `${width}rem`;
    spanStyle.maxWidth = `${width}rem`;
  }
  if (height) {
    spanStyle.height = `${height}rem`;
    spanStyle.minHeight = `${height}rem`;
    spanStyle.maxHeight = `${height}rem`;
  }

  const onIconClick = (ev: React.MouseEvent) => {
    // 阻止冒泡
    if (ev && onClick) {
      ev.stopPropagation();
      if (ev.nativeEvent && ev.nativeEvent.stopImmediatePropagation) {
        ev.nativeEvent.stopImmediatePropagation();
      }
      onClick();
    }
  };

  const beforeInjection = (svg: SVGElement) => {
    // 设置svg样式
    let svgStyle: string = '';
    if (color) {
      svgStyle = `fill: ${color}; color: ${color};`;
    }
    if (width) {
      svgStyle += `width: ${width}rem;`;
    }
    if (height) {
      svgStyle += `height: ${height}rem;`;
    }
    if (transform) {
      svgStyle += `transform: ${transform};`;
    }
    if (svgStyle === '') {
      return;
    }
    svg.setAttribute('style', svgStyle);
  };

  return (
    <ReactSVG
      ref={ref}
      style={spanStyle}
      beforeInjection={beforeInjection}
      src={`${baseUrl}/svg/${name}.svg`}
      wrapper={wrapper}
      className={classNames(cls, className)}
      onClick={onIconClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
};

export default React.memo(React.forwardRef<HTMLElement, IconProps>(Icon));
