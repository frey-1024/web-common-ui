import React from 'react';

interface ScriptProps {
  url: string;
  onError: () => {};
  onLoad: () => {};
  beforeCode?: string;
  attributes?: object;
  onCreate?: () => {};
}

/**
 * 动态加入js 代码
 * @param code
 */
function loadScriptCode(code: string) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex) {
    // 兼容IE
    script.text = code;
  }
  document.body.appendChild(script);
}
/**
 * 动态创建和加载js文件，比如jquery
 */
export default class Script extends React.Component<ScriptProps> {
  static defaultProps = {
    beforeCode: '',
    attributes: {},
    onCreate: () => {},
    onError: () => {},
    onLoad: () => {}
  };
  scriptObservers: object = {};
  idCount: number = 0;
  scriptLoaderId: string = '';

  componentDidMount() {
    this.loadSrc(true);
  }

  componentDidUpdate(prevProps: ScriptProps) {
    this.loadSrc(false, prevProps);
  }

  // url变化就创建一个新的标签
  loadSrc = (isRefresh: boolean, preProps?: ScriptProps) => {
    const { url, beforeCode } = this.props;
    if (isRefresh || url !== preProps.url) {
      if (beforeCode) {
        loadScriptCode(beforeCode);
      }
      this.scriptLoaderId = `id${this.idCount++}`;
      this.scriptObservers[url] = { [this.scriptLoaderId]: this.props };
      this.createScript();
    }
  };

  createScript() {
    const { onCreate, url, attributes } = this.props;
    const script = document.createElement('script');

    onCreate();

    if (attributes) {
      Object.keys(attributes).forEach(prop => script.setAttribute(prop, attributes[prop]));
    }

    script.src = url;

    if (!script.hasAttribute('async')) {
      script.async = true;
    }

    const callObserverFuncAndRemoveObserver = (
      shouldRemoveObserver: (observer: ScriptProps) => boolean
    ) => {
      const observers = this.scriptObservers[url];
      Object.keys(observers).forEach(key => {
        if (shouldRemoveObserver(observers[key])) {
          delete this.scriptObservers[url][this.scriptLoaderId];
        }
      });
    };
    script.onload = () => {
      callObserverFuncAndRemoveObserver(observer => {
        observer.onLoad();
        return true;
      });
    };

    script.onerror = () => {
      callObserverFuncAndRemoveObserver(observer => {
        observer.onError();
        return true;
      });
    };

    document.body.appendChild(script);
  }

  render() {
    return null;
  }
}
