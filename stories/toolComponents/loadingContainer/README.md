# LoadingContainer 容器加载组件

支持 PC 和 Mobile 端

*可以直接把内容内嵌到 LoadingContainer 中，将现有容器变为加载状态。*

```javascript
import { LoadingContainer } from 'autobest-common-ui';

export default class LoadingContainerDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  demoAjax1 = () => {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 2000);
  };

  render() {
    const { loading } = this.state;
    return (
      <LoadingContainer className="demo-loading-container" loading={loading}>
        <button onClick={this.demoAjax1}>点击 Loading 2s</button>
        这是内容
        <br />
        这是内容 这是内容 这是内容 这是内容 这是内容 这是内容
      </LoadingContainer>
    );
  }
}
```

## open 方法接收参数说明

| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| className | 空 | string | 容器样式 |
| loading | false | boolean | 容器是否loading |
| children | null | node | 内容区域 |

## 注意

这个是完整的容器，修饰的元素需要都放到此容器中，不能单独只修改标签名。它是直接在原来的基础上创建一个新的元素。

