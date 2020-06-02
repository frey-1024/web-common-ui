# Script 动态加入js 代码

支持 PC 和 Mobile 端

## Demo
```javascript
import { Script } from 'autobest-common-ui';

export default class ScriptDemo extends React.Component {
  render() {
    return (
        <Script
          url="https://underscorejs.bootcss.com/underscore-min.js"
          onLoad={() => {
              console.log('onLoad');
            }}
            onError={() => {
              console.log('onError');
            }}
        />
     );
  }
}

```
## 参数说明
| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| url | 无 | string, 必传 | 需要动态加载的js路径 |
| onError | 无 | func | 加载失败后调用的函数 |
| onLoad | 无 | func | 加载成功后调用的函数 |
| beforeCode | 无 | string | 创建脚本前执行的js代码 |
| attributes | 无 | object | 给script标签添加的属性, async属性默认为true |
| onCreate | 无 | func | 在beforeCode后，但发起请求之前 |