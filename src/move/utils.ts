import { getClientPosition } from '../utils/get';

export type Position = {
  x: number;
  y: number;
};

export function getDistance(touches): number {
  const start = {
    x: touches[0].pageX,
    y: touches[0].pageY
  };
  const end = {
    x: touches[1].pageX,
    y: touches[1].pageY
  };
  return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}

export function getTransformOrigin(touches, pElement, translate): string {
  const start = {
    x: touches[0].pageX,
    y: touches[0].pageY
  };
  const end = {
    x: touches[1].pageX,
    y: touches[1].pageY
  };
  const { left, top } = getClientPosition(pElement);
  const minTouchX = start.x > end.x ? end.x : start.x;
  const minTouchY = start.y > end.y ? end.y : start.y;
  const x = Math.abs(end.x - start.x) / 2 + minTouchX;
  const y = Math.abs(end.y - start.y) / 2 + minTouchY;
  return `${x - left - translate.x}px ${y - top - translate.y}px`;
}

export function getInitElementPlacement({
  elementSize,
  elementParentSize,
  horizontalPlacement,
  verticalPlacement
}): Position {
  let translateX = 0;
  let translateY = 0;

  switch (horizontalPlacement) {
    case 'center':
      translateX = (elementParentSize.width - elementSize.width) / 2;
      break;
    case 'right':
      translateX = elementParentSize.width - elementSize.width;
      break;
    default:
      translateX = 0;
  }

  switch (verticalPlacement) {
    case 'center':
      translateY = (elementParentSize.height - elementSize.height) / 2;
      break;
    case 'bottom':
      translateY = elementParentSize.height - elementSize.height;
      break;
    default:
      translateY = 0;
  }

  return {
    x: translateX,
    y: translateY
  };
}
