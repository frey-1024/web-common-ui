# LazyImage 图片按需加载组件

支持 PC 和 Mobile 端

## 该组件支持全局设置默认图片

全局设置是指，在项目index.js 页面进行初始设置，指定默认图片

```javascript
import { useConfig } from 'autobest-common-ui/index';

useConfig({
  assetBaseUrl: 'https://assets-web.test.autobestdevops.com/common-ui'
});
```

此时，在 config 中组装成 `assetBaseUrl/svg/empty.svg`

## 对当前组件进行默认图片设置

```javascript
import { LazyImage } from 'autobest-common-ui';

<LazyImage
  defaultImage={require('./assets/imgs/p_image_holder.png')}
  src="http://192.168.1.128:9099/resources/part-image/featured/Prime/small/Default/water-pump.jpg"
  alt="111111"
/>
```

## 注意

`全局优先级 **小于** 当前运行组件优先级`

也就是 在全局设置后，可以在需要的页面再进行设置，满足个性需求。

## Demo
```javascript
import { LazyImage } from 'autobest-common-ui';

export default class LazyImageDemo extends React.Component {
  isMobile = false;
  render() {
    return (
      <LazyImage
        src="http://192.168.1.128:9099/resources/part-image/featured/Prime/small/Default/water-pump.jpg"
        alt="111111"
        hoverOpacity={0.5}
        isMobile={this.isMobile}
      />
    );
  }
}
```
## 参数说明

| 属性 | 默认值 | 是否必填 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ | ------ |
| src | 空 | 是 | string | 需要显示的图片 |
| alt | 空 | 是 | string | 图片描述 |
| defaultImage | （这个比较特殊，有其全局默认值） | 否 | string | 按需加载前的图片 |
| title | 空 | 否 | string | 鼠标悬浮时显示的文字 |
| className | 空 | 否 | string | 类名 |
| hoverOpacity | null | 否 | number | hover 图片，图片透明度(需要注意不要少了isMobile属性) |
| isMobile | false | 否 | boolean | 判断是否是移动端，如果是移动端，将不再执行hoverOpacity, onMouseOver, onMouseOut |
| active | true | 否 | boolean | 判断是否需要动态loading效果，如果提供了defaultImage，则不再有loading |
| onMouseOver | 空 | 否 | function | 鼠标放上去的回调（方便自定义样式） |
| onMouseOut | 空 | 否 | function | 鼠标离开的回调（方便自定义样式） |
| onLoading | 空 | 否 | function | 加载图片时的回调 |
| onLoaded | 空 | 否 | function | 图片加载成功时的回调 |
| onError | 空 | 否 | function | 图片加载失败时的回调 |


## 注意

其他和`<img/>`标签相同: 支持className, 事件等。

