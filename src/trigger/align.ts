export interface Size {
  width: number;
  height: number;
}

interface ElementInfo extends Size {
  left: number;
  top: number;
}

interface Params {
  rootInfo: ElementInfo;
  popInfo: ElementInfo;
  translateX: number;
  translateY: number;
  rootToPopupSpacing: number;
  hiddenArrow: boolean;
  isTransformHorizontalDirection: boolean;
}

export interface ResultProps extends ElementInfo {
  transformOrigin: string;
  rootWidth: number;
  arrowStyle: {
    transform?: string;
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
}

export function getAvailSize(): Size {
  if (document.compatMode === 'BackCompat') {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    };
  }
  return {
    width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
    height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
  };
}

/* 具体方位 */
export function getLeftLocationInfo({
  rootInfo,
  popInfo,
  translateY = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowTop = popInfo.height / 2 - translateY;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left - (rootToPopupSpacing + popInfo.width),
    top: rootInfo.top - (popInfo.height / 2 - rootInfo.height / 2) + translateY,
    arrowStyle: hiddenArrow
      ? {}
      : {
          top: `${arrowTop}px`,
          right: '-4px',
          transform: 'translateY(-50%) rotate(-45deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `right center` : `right ${arrowTop}px`
  };
}

export function getRightLocationInfo({
  rootInfo,
  popInfo,
  translateY = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowTop = popInfo.height / 2 - translateY;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + rootToPopupSpacing + rootInfo.width,
    top: rootInfo.top - (popInfo.height / 2 - rootInfo.height / 2) + translateY,
    arrowStyle: hiddenArrow
      ? {}
      : {
          top: `${arrowTop}px`,
          left: '-4px',
          transform: 'translateY(-50%) rotate(-225deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `left center` : `left ${arrowTop}px`
  };
}

export function getTopLocationInfo({
  rootInfo,
  popInfo,
  translateX = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowLeft = popInfo.width / 2 - translateX;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + rootInfo.width / 2 - popInfo.width / 2 + translateX,
    top: rootInfo.top - (rootToPopupSpacing + popInfo.height),
    arrowStyle: hiddenArrow
      ? {}
      : {
          left: `${arrowLeft}px`,
          bottom: '-4px',
          transform: 'translateX(-50%) rotate(45deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `center bottom` : `${arrowLeft}px bottom`
  };
}

export function getBottomLocationInfo({
  rootInfo,
  popInfo,
  translateX = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowLeft = popInfo.width / 2 - translateX;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + rootInfo.width / 2 - popInfo.width / 2 + translateX,
    top: rootInfo.top + rootInfo.height + rootToPopupSpacing,
    arrowStyle: hiddenArrow
      ? {}
      : {
          left: `${arrowLeft}px`,
          top: '-4px',
          transform: 'translateX(-50%) rotate(-135deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `center top` : `${arrowLeft}px top`
  };
}

/* 其他方位 */
export function getLeftTopLocationInfo({
  rootInfo,
  popInfo,
  translateY = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowTop = rootInfo.height / 2 - translateY;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left - (rootToPopupSpacing + popInfo.width),
    top: rootInfo.top + translateY,
    arrowStyle: hiddenArrow
      ? {}
      : {
          top: `${arrowTop}px`,
          right: '-4px',
          transform: 'translateY(-50%) rotate(-45deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `right center` : `right ${arrowTop}px`
  };
}

export function getLeftBottomLocationInfo({
  rootInfo,
  popInfo,
  translateY = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowTop = popInfo.height - rootInfo.height / 2 - translateY;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left - (rootToPopupSpacing + popInfo.width),
    top: rootInfo.top + rootInfo.height - popInfo.height + translateY,
    arrowStyle: hiddenArrow
      ? {}
      : {
          top: `${arrowTop}px`,
          right: '-4px',
          transform: 'translateY(-50%) rotate(-45deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `right center` : `right ${arrowTop}px`
  };
}

export function getRightTopLocationInfo({
  rootInfo,
  popInfo,
  translateY = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowTop = rootInfo.height / 2 - translateY;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + rootToPopupSpacing + rootInfo.width,
    top: rootInfo.top + translateY,
    arrowStyle: hiddenArrow
      ? {}
      : {
          top: `${arrowTop}px`,
          left: '-4px',
          transform: 'translateY(-50%) rotate(-225deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `left center` : `left ${arrowTop}px`
  };
}

export function getRightBottomLocationInfo({
  rootInfo,
  popInfo,
  translateY = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowTop = popInfo.height - rootInfo.height / 2 - translateY;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + rootToPopupSpacing + rootInfo.width,
    top: rootInfo.top + rootInfo.height - popInfo.height + translateY,
    arrowStyle: hiddenArrow
      ? {}
      : {
          top: `${arrowTop}px`,
          left: '-4px',
          transform: 'translateY(-50%) rotate(-225deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `left center` : `left ${arrowTop}px`
  };
}

export function getTopLeftLocationInfo({
  rootInfo,
  popInfo,
  translateX = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowLeft = rootInfo.width / 2 - translateX;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + translateX,
    top: rootInfo.top - (rootToPopupSpacing + popInfo.height),
    arrowStyle: hiddenArrow
      ? {}
      : {
          left: `${arrowLeft}px`,
          bottom: '-4px',
          transform: 'translateX(-50%) rotate(45deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `center bottom` : `${arrowLeft}px bottom`
  };
}

export function getTopRightLocationInfo({
  rootInfo,
  popInfo,
  translateX = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowLeft = popInfo.width - rootInfo.width / 2 - translateX;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left - (popInfo.width - rootInfo.width) + translateX,
    top: rootInfo.top - (rootToPopupSpacing + popInfo.height),
    arrowStyle: hiddenArrow
      ? {}
      : {
          left: `${arrowLeft}px`,
          bottom: '-4px',
          transform: 'translateX(-50%) rotate(45deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `center bottom` : `${arrowLeft}px bottom`
  };
}

export function getBottomLeftLocationInfo({
  rootInfo,
  popInfo,
  translateX = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowLeft = rootInfo.width / 2 - translateX;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left + translateX,
    top: rootInfo.top + rootInfo.height + rootToPopupSpacing,
    arrowStyle: hiddenArrow
      ? {}
      : {
          left: `${arrowLeft}px`,
          top: '-4px',
          transform: 'translateX(-50%) rotate(-135deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `center top` : `${arrowLeft}px top`
  };
}

export function getBottomRightLocationInfo({
  rootInfo,
  popInfo,
  translateX = 0,
  rootToPopupSpacing,
  isTransformHorizontalDirection,
  hiddenArrow
}: Params): ResultProps {
  const arrowLeft = popInfo.width - rootInfo.width / 2 - translateX;
  return {
    rootWidth: rootInfo.width,
    width: popInfo.width,
    height: popInfo.height,
    left: rootInfo.left - (popInfo.width - rootInfo.width) + translateX,
    top: rootInfo.top + rootInfo.height + rootToPopupSpacing,
    arrowStyle: hiddenArrow
      ? {}
      : {
          left: `${arrowLeft}px`,
          top: '-4px',
          transform: 'translateX(-50%) rotate(-135deg)'
        },
    transformOrigin: isTransformHorizontalDirection ? `center top` : `${arrowLeft}px top`
  };
}
