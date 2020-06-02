# Popover 气泡卡片组件

支持 PC 和 Mobile 端

```javascript
import { Popover } from 'autobest-common-ui';

export default class PopoverDemo extends React.Component {
  render() {
    return (
      <div className="demo-popover">
        <Popover tip="111111111111111" placement="bottom" trigger="click">
          <button onClick={this.onOpenModal}>点击</button>
        </Popover>
      </div>
    );
  }
}
```

## 说明

该组件支持动态判断，并确定相应方向，当达到LimitSpacing(临界间距是14px), 会修改方向，并展示相应UI


## 参数说明

| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| tip | 字符串或者element元素 | node | 气泡内容 |
| isMobile | false | boolean | 用于判断当前是不是移动端|
| wrapClassName | 无 | class样式名 | 主体样式, 这里可以定义内容宽度,高度, border等 |
| innerClassName | 无 | class样式名 | 内容样式，可以定义内容元素样式 |
| arrowClassName | 无 | class样式名 | 箭头样式重置 |
| placement | top | string | 位置包括：top, topLeft topRight, bottom, bottomLeft, bottomRight, right, rightTop, rightBottom, left, leftTop, leftBottom  |
| trigger | hover | string | 触发事件：'**hover**' 、 '**click**'、'**focus**' |
| visible | / | boolean | 用于手动控制浮层显隐 |
| closeClassName | 空 | string | 对当前Popover close图标, 重置样式 |
| hiddenClose | true | boolean | 是否隐藏close图标 |
| closeIcon | 空 | node | 自定义close图标， 但是hiddenClose必须为false |
| showMask | false | boolean | 用于嵌套多个弹框提示时， 点击别处只隐藏当前元素 |
| clickHiddenWithFocus | false | boolean | 用于当 `trigger = focus` 时，点击document回调onVisibleChange函数 |
| name | 空 | 字符串 | 用于标识当前组件， 回调函数第二个参数进行返回 |
| mouseEnterDelay | 0 | number | 显示时的延迟时间 单位：秒 |
| mouseLeaveDelay | 0.1 | number | 隐藏时延迟时间 单位：秒 |
| onVisibleChange |  /  | 函数 | visible变化的回调函数，回调函数返回status和name |
| onDestroy |  /  | 函数 | 隐藏后的回调函数 |

## 注意

此组件children必须仅有一个子级。

请确保子元素能接受onMouseEnter、`onMouseLeave`、onFocus、onClick 事件
