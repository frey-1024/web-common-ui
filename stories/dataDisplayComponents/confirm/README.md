# Confirm 确认框组件

支持 PC 和 Mobile 端

## 引入方式
```javascript
import { Confirm } from 'autobest-common-ui';
```
## 使用方式

```javascript
export default class ConfirmDemo extends React.Component {
  isMobile = isMobile();
  onDeleteAddress = () => {
    Confirm({
      okText: 'Delete',
      cancelText: 'Cancel',
      content: <strong>Delete this address</strong>,
      onOk: async () => {
        console.log('Delete');
      },
      onCancel: () => {
        console.log('Cancel');
      }
    });
  };
  render() {
    return <button onClick={this.onDeleteAddress}>打开按钮</button>;
  }
}
```
## Confirm 方法参数说明

| 属性 | 必传 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ | ------ |
| okText | 非 | Confirm | string | 确认按钮文字 |
| cancelText | 非 | Cancel | string | 取消按钮文字 |
| okClassName | 非 | 无 | class样式名 | 确认按钮样式 |
| cancelClassName | 非  | 无 | class样式名 | 取消按钮样式 |
| reverse | 非 | false | boolean | 按钮顺序是否颠倒 |
| content | 非 | Are you sure? | node | 提示主题文字 |
| width | 非 | 3.6rem | string | 弹出框宽度 |
| onOk | 非 | / | 函数 | 点击确认的回调函数 |
| onCancel | 非 | / | 函数 | 点击取消的回调函数 |

## 更新说明

1. `onCancel` 换成 `onClose`;
2. `Confirm` 返回 两个方法, 其中forceUpdate 是可以手动刷新弹框UI；

```javascript
return {
  destroy: close,
  forceUpdate: (config: ConfirmProps) => any
};
```


## 注意

此组件为方法组件，具体参数可参考`Modal`组件中其他属性

