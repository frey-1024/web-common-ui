import Perfume from 'perfume.js';
import { isObject } from '../string';

const collectMetricName = ['fid', 'fcp', 'fp', 'lcp', 'cls', 'tbt'];

export default function setPerformance(trackPerformance, minFid: number, minFcp: number) {
  if (
    !window.PerformanceObserver ||
    !window.navigator ||
    !window.navigator.storage ||
    !window.navigator.storage.estimate
  ) {
    return;
  }
  // 性能统计
  const performanceParams: { fid?: number; fcp?: number; cls?: number } = {};
  let trackId: string;
  // eslint-disable-next-line no-new
  new Perfume({
    analyticsTracker: ({ metricName, data }) => {
      if (collectMetricName.includes(metricName)) {
        performanceParams[metricName] = isObject(data) ? JSON.stringify(data) : data;
        // 用户操作页面才收集，否则收集的信息没有多少价值
        if (
          performanceParams.fid &&
          ((performanceParams.fid > minFid && performanceParams.fcp > minFcp) ||
            performanceParams.cls)
        ) {
          trackId = trackPerformance(performanceParams, trackId);
        }
      }
    }
  });
}
