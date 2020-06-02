import { getCookie } from '../cookies';
import { canUseDOM } from '../string';
import Queue, { Level } from './Queue';
import { sendBeacon, ajax } from './sendBeacon';

export interface Context {
  version: string;
  site: string;
}

export interface Config {
  project: string;
  apiUrl: string;
  delay: number;
}

export default class ApplicationInsights {
  static queue = null;
  static apiUrl = null;
  config: Config;
  context: Context;
  isBindUnload = false;
  timer = null;
  constructor(config, context: Context) {
    this.config = { delay: 5000, ...config };
    this.context = context;
    // 由于 unload 会销毁实例化的queue，这里使用静态方式，阻止销毁
    ApplicationInsights.queue = new Queue();
    ApplicationInsights.apiUrl = this.config.apiUrl;
  }

  /**
   * 收集信息
   * @param level 'error' | 'warn' | 'info'
   * @param data 数据
   * @param label 其他信息
   * @param updateId id
   */
  public track(level: Level, data, label?: string, updateId?: string) {
    let guid = '';
    try {
      guid = getCookie('GuidNew');
    } catch (e) {}

    // 加入一些全局信息
    data = { ...this.context, href: window.location.href, guid, ...data };

    if (!updateId || !ApplicationInsights.queue.has()) {
      const id = ApplicationInsights.queue.add(level, data, label);
      this._collectHandle();
      return id;
    }
    return ApplicationInsights.queue.update(updateId, level, data, label);
  }

  /**
   * 对收集的信息进行处理
   * @private
   */
  private _collectHandle() {
    // 只监听一次
    if (canUseDOM && !this.isBindUnload) {
      this.isBindUnload = true;
      window.addEventListener('unload', this._onUnload, false);
    }
    clearTimeout(this.timer);

    // 当收集的信息超过3条，则立刻收集，防止请求时，超出参数范围
    if (ApplicationInsights.queue.has(3)) {
      this._polling();
      return;
    }

    // 延迟收集吗， 防止阻塞UI渲染
    this.timer = setTimeout(() => {
      this._polling();
    }, this.config.delay);
  }

  /**
   * 调用接口，上传日志信息，并清空已经上传的
   * @private
   */
  private _polling() {
    clearTimeout(this.timer);
    // 判断是否有信息，没有将不做操作
    if (!ApplicationInsights.queue.has()) {
      return;
    }
    // 这里不用判断是否上传成功，意义不大
    ajax(ApplicationInsights.apiUrl, { value: ApplicationInsights.queue.getAll() });
    // 清空已经上传的
    ApplicationInsights.queue.removeAll();
  }

  /**
   * unload 后的回调函数，处理剩余的日志信息
   * @private
   */
  private _onUnload() {
    if (this && this.timer) {
      clearTimeout(this.timer);
    }
    // 判断是否有信息，没有将不做操作
    if (!ApplicationInsights.queue.has()) {
      return true;
    }
    sendBeacon(ApplicationInsights.apiUrl, {
      value: ApplicationInsights.queue.getAll()
    });
    // 清空已经上传的
    ApplicationInsights.queue.removeAll();
  }
}
