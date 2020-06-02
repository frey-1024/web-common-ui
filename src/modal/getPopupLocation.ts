import { getClientSize, getElementSize } from '../utils/get';

export interface PopupLocationArgs {
  placement: string;
  element: HTMLElement;
  popupLimitSpacing: number;
  targetTop?: string;
}

export default function getPopupLocation({
  placement,
  element,
  targetTop,
  popupLimitSpacing
}: PopupLocationArgs) {
  const clientSize = getClientSize();
  const popupSize = getElementSize(element);

  const doubleLimit = popupLimitSpacing * 2;

  const height =
    popupSize.height > clientSize.height - doubleLimit
      ? `${clientSize.height - doubleLimit}px`
      : '';
  // 底部滚动条暂时不需要， 可通过设置top来解决
  let top = (clientSize.height + popupLimitSpacing - popupSize.height) / 2;

  if (top < popupLimitSpacing) {
    top = popupLimitSpacing;
  }

  if (placement === 'top') {
    return {
      top: targetTop,
      height
    };
  }

  // 默认center
  return {
    top: `${top}px`,
    height
  };
}
