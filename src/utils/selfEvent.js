class SelfEvent {
  constructor() {
    this.listeners = [];
    this.instance = null;
  }
  static getInstance() {
    // 单例模式
    return this.instance || (this.instance = new SelfEvent());
  }
  _findPrevListener(eventName) {
    const l = this.listeners.length;
    for (let i = 0, listener; i < l; i++) {
      listener = this.listeners[i];
      if (listener && listener.eventName === eventName) {
        return { listener, index: i };
      }
    }
    return { listener: null, index: null };
  }
  _addListener(eventName, handler, context) {
    const { listener } = this._findPrevListener(eventName);
    if (listener) {
      const handlers = listener.handlers;
      if (handlers) {
        const size = handlers.length;
        // 判断已经有相同的handler就禁止再添加
        for (let i = 0, h; i < size; i++) {
          h = handlers[i];
          if (h.context === context && h.handler === handler) {
            return;
          }
        }
      }
      listener.handlers.push({
        context,
        handler
      });
    } else {
      this.listeners.push({
        eventName,
        handlers: [
          {
            context,
            handler
          }
        ]
      });
    }
  }
  _removeListener(index) {
    this.listeners.splice(index, 1);
  }
  // 触发自定义事件
  emit(eventName, params, context) {
    if (!eventName) {
      return;
    }
    const { listener, index } = this._findPrevListener(eventName);
    if (!listener) {
      return;
    }
    const handlers = listener.handlers;
    if (!handlers.length) {
      this._removeListener(index);
      return;
    }
    for (let i = 0, l = handlers.length, item; i < l; i++) {
      item = handlers[i];
      // 保证函数和上下文相同，或者没有上下文
      if (!context || !item.context || item.context === context) {
        item.handler(params);
      }
    }
  }
  // 监听事件变化，触发回调
  on(eventName, handler, context) {
    this._addListener(eventName, handler, context);
    // 返回清除函数，执行清除监听
    return () => {
      this.off(eventName, handler, context);
    };
  }
  off(eventName, handler, context) {
    const { listener, index } = this._findPrevListener(eventName);
    if (!listener) {
      return;
    }
    const handlers = listener.handlers;
    // 当没有指定清除哪个具体函数， 就是清除当前元素所有监听事件
    if (!handler || !handlers.length) {
      this._removeListener(index);
      return;
    }
    for (let i = 0, l = handlers.length, item; i < l; i++) {
      item = handlers[i];
      // 保证函数和上下文相同，或者没有上下文
      if (item.handler === handler && (!context || !item.context || item.context === context)) {
        // 如果已经是最后一条数据了，也清除当前元素监听
        if (l < 2) {
          this._removeListener(index);
          return;
        }
        handlers.splice(i, 1);
        break;
      }
    }
  }
}

export default SelfEvent.getInstance();
