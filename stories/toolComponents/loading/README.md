# Loading 全部 Screen 组件

支持 PC 和 Mobile 端


```javascript
import { Loading } from 'autobest-common-ui';

export default class LoadingDemo extends React.Component {
  demoAjax1 = async () => {
    Loading.open();
    await new Promise(resolve =>
      setTimeout(() => {
        resolve('ok');
      }, 2000)
    );
    Loading.close();
  };
  demoAjax2 = async () => {
      Loading.open({isRectLoading: true});
      await new Promise(resolve =>
        setTimeout(() => {
          resolve('ok');
        }, 2000)
      );
      Loading.close();
    };

  render() {
    return (
      <div className="demo-loading">
        <button onClick={this.demoAjax1}>点击 第一种 Loading 2s</button>
        <button onClick={this.demoAjax2}>点击 第二种 Loading 2s</button>
      </div>
    );
  }
}
```

## open 方法接收参数说明

| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| expire | 0 | number | loading开始后自动隐藏的时间，单位：毫秒 |
| isRectLoading | false | boolean | loading 样式的另一种 |

## open 方法返回值说明

当执行 `open` 方法后，会返回一个唯一标识符（id），代表这次loading, 当只想关闭这个loading时，可以这么做：

```javascript
const id = Loading.open();
Loading.close(id);
```

他主要解决多个Loading时，指定关闭项，如果指定的Id都已经关闭，则UI中loading就会隐藏。

`注意`： 当在loading时， 有方法没有指定关闭loading id， 则代表全部关闭：

```javascript
// 方法1中有这段代码
const id = Loading.open();
// 这里执行30秒后在执行下一步
Loading.close(id);

// 方法2中有这段代码, 而且立即执行
Loading.open();
Loading.close();
```

此时，loading将会消失。Id也会清空，`Loading.close(id)` 也就没有作用了。

## 注意

此组件和其它组件不同，它是静态对象，提供静态方法（open和close），此组件更像一个方法，不能写在render中。

