import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import UseConfig from '../use-config';
import { canUseDOM } from '../utils/string';
import LoadingIcon from '../loading-icon';

export interface ConfigProps {
  isRectLoading?: boolean;
  expire?: number;
}

// 缓存创建的loading元素
let loadingElement: HTMLDivElement = null;
let loadingTimer: any = null;
let closeTimer: any = null;

const cls: string = 'ab-loading';

function getLoadingContainer(isRectLoading: boolean) {
  return (
    <div className={classNames(`${cls}-wrap`, { [`${cls}-rect-loading`]: isRectLoading })}>
      {isRectLoading ? (
        <img
          className={`${cls}-content`}
          src={`${UseConfig.assetBaseUrl}/images/p_loading_rect.gif`}
          alt="loading..."
        />
      ) : (
        <LoadingIcon className={`${cls}-content`} />
      )}
    </div>
  );
}

// openIds 容器
let openIds = [];
// closeIds 容器
let closeIds = [];

let prevIsRectLoading = false;

function createLoading(isRectLoading: boolean) {
  loadingElement = document.createElement('div');
  document.body.appendChild(loadingElement);
  ReactDOM.render(getLoadingContainer(isRectLoading), loadingElement);
}
export default class Loading {
  static open(config?: ConfigProps) {
    if (!canUseDOM) {
      return;
    }
    config = { isRectLoading: false, expire: 0, ...config };
    // 防止重复创建
    if (!loadingElement) {
      createLoading(config.isRectLoading);
    } else if (prevIsRectLoading !== config.isRectLoading) {
      // loading 类型不同时，重新创建
      document.body.removeChild(loadingElement);
      createLoading(config.isRectLoading);
    } else {
      loadingElement.style.display = 'block';
    }
    prevIsRectLoading = config.isRectLoading;
    // 如果配置中有expire且大于0
    // 将会在到达时间后自动关闭，不用手动再关闭（不需要再close()）
    if (config.expire > 0) {
      loadingTimer = setTimeout(() => {
        Loading.close();
      }, config.expire);
    }
    const id = new Date().getTime();
    openIds.push(id);
    return id;
  }
  static close(closeId?: any) {
    if (!canUseDOM) {
      return;
    }
    // 防止重复关闭
    if (loadingTimer) {
      clearTimeout(loadingTimer);
    }
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    if (!closeId) {
      openIds = [];
      closeIds = [];
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      return;
    }
    closeIds.push(closeId);
    // 代码执行时，由于一些接口loading很短暂，而另一个接口还没有开始调用，
    // 只有closeId是不能真正解决一些特殊loading抖动情况，
    // 根据js的任务队列，我们加入setTimeout，只有主线程结束后才执行销毁
    closeTimer = setTimeout(() => {
      closeIds.forEach(id => {
        const index = openIds.indexOf(id);
        if (index >= 0) {
          openIds.splice(index, 1);
        }
      });
      if (!openIds.length) {
        closeIds = [];
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      }
    });
  }
}
