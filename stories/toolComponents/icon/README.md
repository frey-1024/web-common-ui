# Icon 图标组件

支持 PC 和 Mobile 端

## Demo
```javascript
import { Icon } from 'autobest-common-ui';

export default class IconDemo extends React.Component {
  render() {
    return (
      <Icon name={name} />
    );
  }
}

```
## 参数说明
  
| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| className | 无 | class样式名 | 图标样式 |
| name | 无 | string | 图标名字 |
| assetBaseUrl | 无 | string | 静态资源基础链接，这块是自定义资源使用的 |
| wrapper | span | string (只能是span或div) | 图标组件外部嵌套的标签名 |
| color | 无 | string | 图标颜色值， svg 需要支持，如果已经有颜色，这个属性没有效果 |
| width | 无 | number | 图标宽度, 单位： rem |
| height | 无 | number | 图标高度, 单位： rem |
| transform | 无 | string | 图标变换， 值是 css 的transform|
| onClick | 无 | function | 图标点击的回调函数 |

## 注意

assetBaseUrl 分为属性和静态属性。

静态属性是在全局进行设置的。

```javascript
import { useConfig } from 'autobest-common-ui/index';

useConfig({
  assetBaseUrl: 'https://assets-web.test.autobestdevops.com/common-ui'
});
```

