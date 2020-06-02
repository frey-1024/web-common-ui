import { LocationType } from './constants';
import { getOffset } from '../utils/get';
import {
  ResultProps,
  Size,
  getAvailSize,
  getTopLocationInfo,
  getBottomLocationInfo,
  getLeftLocationInfo,
  getRightLocationInfo,
  getLeftTopLocationInfo,
  getLeftBottomLocationInfo,
  getRightTopLocationInfo,
  getRightBottomLocationInfo,
  getTopLeftLocationInfo,
  getTopRightLocationInfo,
  getBottomLeftLocationInfo,
  getBottomRightLocationInfo
} from './align';

function getTranslateX(
  { left, width }: ResultProps,
  availSize: Size,
  initTranslateX: number,
  popupLimitSpacing: number
) {
  if (width <= availSize.width) {
    const limit = initTranslateX ? 0 : popupLimitSpacing;
    if (left < limit) {
      return -left + limit;
    }
    if (left + width + limit > availSize.width) {
      return availSize.width - (left + width + limit);
    }
  }
  return 0;
}

function getTranslateY({ top, height }: ResultProps, availSize: Size, popupLimitSpacing: number) {
  if (top < popupLimitSpacing) {
    return -top + popupLimitSpacing;
  }
  if (height < availSize.height && top + height + popupLimitSpacing > availSize.height) {
    return availSize.height - top - height - popupLimitSpacing;
  }
  return 0;
}
/**
 * 获取 popup 元素接下来的位置信息
 * @returns {*}
 */
export default function getPopupLocation(
  placement: string,
  rootEl: HTMLElement,
  popupEl: HTMLElement,
  initTranslateX: number,
  initTranslateY: number,
  rootToPopupSpacing: number,
  popupLimitSpacing: number,
  isTransformHorizontalDirection: boolean,
  hiddenArrow: boolean
) {
  const rootInfo = getOffset(rootEl);
  const popInfo = getOffset(popupEl);
  const availSize = getAvailSize();
  const params = {
    rootInfo,
    popInfo,
    isTransformHorizontalDirection,
    rootToPopupSpacing,
    hiddenArrow,
    translateX: initTranslateX,
    translateY: initTranslateY
  };
  if (placement === LocationType.Top.value) {
    const result = getTopLocationInfo(params);
    const translateX = getTranslateX(result, availSize, initTranslateX, popupLimitSpacing);
    if (result.top < popupLimitSpacing) {
      return getBottomLocationInfo({ ...params, translateX });
    }
    if (!translateX) {
      return result;
    }
    return getTopLocationInfo({ ...params, translateX });
  }
  if (placement === LocationType.Bottom.value) {
    const result = getBottomLocationInfo(params);
    const translateX = getTranslateX(result, availSize, initTranslateX, popupLimitSpacing);
    // 已经超出底部
    if (
      result.top + result.height + popupLimitSpacing > availSize.height &&
      rootInfo.top - (rootToPopupSpacing + popInfo.height) > popupLimitSpacing
    ) {
      return getTopLocationInfo({ ...params, translateX });
    }
    // 正常情况直接返回
    if (!translateX) {
      return result;
    }
    return getBottomLocationInfo({ ...params, translateX });
  }
  if (placement === LocationType.Left.value) {
    const result = getLeftLocationInfo(params);
    const translateY = getTranslateY(result, availSize, popupLimitSpacing);
    if (result.left < popupLimitSpacing) {
      return getRightLocationInfo({ ...params, translateY });
    }
    if (!translateY) {
      return result;
    }
    return getLeftLocationInfo({ ...params, translateY });
  }
  if (placement === LocationType.Right.value) {
    const result = getRightLocationInfo(params);
    const translateY = getTranslateY(result, availSize, popupLimitSpacing);
    if (
      result.left + result.width + popupLimitSpacing > availSize.width &&
      rootInfo.left - (rootToPopupSpacing + popInfo.width) > popupLimitSpacing
    ) {
      return getLeftLocationInfo({ ...params, translateY });
    }
    // 不再重新计算
    if (!translateY) {
      return result;
    }
    return getRightLocationInfo({ ...params, translateY });
  }

  if (placement === LocationType.LeftTop.value || placement === LocationType.LeftBottom.value) {
    const isLeftTop = placement === LocationType.LeftTop.value;
    const result = isLeftTop ? getLeftTopLocationInfo(params) : getLeftBottomLocationInfo(params);
    const translateY = getTranslateY(result, availSize, popupLimitSpacing);
    if (result.left < popupLimitSpacing) {
      return isLeftTop
        ? getRightTopLocationInfo({ ...params, translateY })
        : getRightBottomLocationInfo({ ...params, translateY });
    }
    if (!translateY) {
      return result;
    }
    return isLeftTop
      ? getLeftTopLocationInfo({ ...params, translateY })
      : getLeftBottomLocationInfo({ ...params, translateY });
  }
  if (placement === LocationType.RightTop.value || placement === LocationType.RightBottom.value) {
    const isRightTop = placement === LocationType.RightTop.value;
    const result = isRightTop
      ? getRightTopLocationInfo(params)
      : getRightBottomLocationInfo(params);
    const translateY = getTranslateY(result, availSize, popupLimitSpacing);
    if (
      result.left + result.width + popupLimitSpacing > availSize.width &&
      rootInfo.left - (rootToPopupSpacing + popInfo.width) > popupLimitSpacing
    ) {
      return isRightTop
        ? getLeftTopLocationInfo({ ...params, translateY })
        : getLeftBottomLocationInfo({ ...params, translateY });
    }
    if (!translateY) {
      return result;
    }
    return isRightTop
      ? getRightTopLocationInfo({ ...params, translateY })
      : getRightBottomLocationInfo({ ...params, translateY });
  }

  if (placement === LocationType.TopLeft.value || placement === LocationType.TopRight.value) {
    const isTopLeft = placement === LocationType.TopLeft.value;
    const result = isTopLeft ? getTopLeftLocationInfo(params) : getTopRightLocationInfo(params);
    const translateX = getTranslateX(result, availSize, initTranslateX, popupLimitSpacing);
    if (result.top < popupLimitSpacing) {
      return isTopLeft
        ? getBottomLeftLocationInfo({ ...params, translateX })
        : getBottomRightLocationInfo({ ...params, translateX });
    }
    if (!translateX) {
      return result;
    }
    return isTopLeft
      ? getTopLeftLocationInfo({ ...params, translateX })
      : getTopRightLocationInfo({ ...params, translateX });
  }

  if (placement === LocationType.BottomLeft.value || placement === LocationType.BottomRight.value) {
    const isBottomLeft = placement === LocationType.BottomLeft.value;
    const result = isBottomLeft
      ? getBottomLeftLocationInfo(params)
      : getBottomRightLocationInfo(params);
    const translateX = getTranslateX(result, availSize, initTranslateX, popupLimitSpacing);
    if (
      result.top + result.height + popupLimitSpacing > availSize.height &&
      rootInfo.top - (rootToPopupSpacing + popInfo.height) > popupLimitSpacing
    ) {
      return isBottomLeft
        ? getTopLeftLocationInfo({ ...params, translateX })
        : getTopRightLocationInfo({ ...params, translateX });
    }
    // 正常情况直接返回
    if (!translateX) {
      return result;
    }
    return isBottomLeft
      ? getBottomLeftLocationInfo({ ...params, translateX })
      : getBottomRightLocationInfo({ ...params, translateX });
  }

  throw new TypeError(
    'Support placement: Top, TopLeft TopRight, Bottom, BottomLeft, BottomRight, Right, RightTop, RightBottom, Left, LeftTop, LeftBottom'
  );
}
