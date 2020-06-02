import ApplicationInsights, { Config, Context } from './ApplicationInsights';
import setPerformance from './performance';

export interface LoggerConfig extends Config {
  performance: boolean;
  performanceMinFid: number;
  performanceMinFcp: number;
}

export default class Logger {
  static appInsights;

  /**
   * 初始化Logger
   */
  static initializeLogger(config: LoggerConfig, context: Context) {
    if (!config.apiUrl) {
      return;
    }

    Logger.appInsights = new ApplicationInsights(config, context);
    if (config.performance) {
      setPerformance(Logger.trackPerformance, config.performanceMinFid, config.performanceMinFcp);
    }
  }

  /**
   * 依赖项日志收集
   * @param value
   */
  static trackDependency(value: object = {}) {
    if (!Logger.appInsights) {
      return;
    }
    Logger.appInsights.track('warn', value, 'client_dependency');
  }

  /**
   * 异常收集
   * @param value
   */
  static trackException(value = {}) {
    if (!Logger.appInsights) {
      return;
    }
    Logger.appInsights.track('error', value, 'client_exception');
  }

  /**
   * 文件加载异常收集
   * @param value
   */
  static trackFileException(value = {}) {
    if (!Logger.appInsights) {
      return;
    }
    Logger.appInsights.track('error', value, 'fileException');
  }

  /**
   * 页面性能收集
   */
  static trackPerformance(value = {}, updateId?: string): string {
    return Logger.appInsights.track('info', value, 'performance', updateId);
  }

  /**
   * 用户点击事件收集
   * @param value
   */
  static trackClickEvent(value = {}) {
    if (!Logger.appInsights) {
      return;
    }
    Logger.appInsights.track('info', value, 'userClickEvent');
  }

  /**
   * site 为空
   * @param value
   */
  static trackEmptySite(value = {}) {
    if (!Logger.appInsights) {
      return;
    }
    Logger.appInsights.track('info', value, 'userEmptySite');
  }
}
