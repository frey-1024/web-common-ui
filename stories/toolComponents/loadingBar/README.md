# LoadingBar 加载 Bar 组件

支持 PC 和 Mobile 端

```javascript
import { LoadingBar } from 'autobest-common-ui';

export default class LoadingBarDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  onLoading = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 3000);
      }
    );
  };
  render() {
    const loading = this.state.loading;
    return (
      <React.Fragment>
        <button onClick={this.onLoading}>点击 Loading 3s</button>
        {loading && <LoadingBar />}
      </React.Fragment>
    );
  }
}
```

## 该组件参数说明

无

## 注意

此组件和其它组件不同，他不接收任何参数，一般用于页面加载的loading，这块在启动项目时，已经配置好。

