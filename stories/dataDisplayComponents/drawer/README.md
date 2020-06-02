# Drawer 收缩面板组件

支持 PC 和 Mobile 端

## 引入方式
```javascript
import { Drawer } from 'autobest-common-ui';
```

## 使用方式

```javascript
export default class DrawerDemo extends React.Component {
  isMobile = isMobile();
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  onOpenDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onCloseDrawer = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <div className="demo-drawer">
        <button onClick={this.onOpenDrawer}>打开Drawer</button>
        <Drawer
          visible={visible}
          onClose={this.onCloseDrawer}
          width={this.isMobile ? '2.88rem' : '3.45rem'}
        >
          <ul>
            <li>
              <a href="javascript:;" rel="nofollow">
                Login/Register
              </a>
            </li>
            <li>
              <a href="/online/account/dashboard" rel="nofollow">
                My Account
              </a>
            </li>
            <li>
              <a href="/online/track/order" rel="nofollow">
                Track Order
              </a>
            </li>
            <li>
              <a href="/online/contact/us">Contact Us</a>
            </li>
          </ul>
        </Drawer>
      </div>
    );
  }
}

```

## 参数说明

| 属性 | 必传 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------  | ------ | ------ | ------ |
| visible | 是 | false | boolean | 用于控制是否展开和隐藏 |
| width | 非 | 2.45rem | string | 抽屉宽度 |
| height | 非 | 2.45rem | string | 抽屉高度 |
| placement | 非 | left | string | 弹框位置包括：'**top**'、'**bottom**'、 '**left**'、'**right**' |
| className | 无 | class样式名 | 展开内容主题样式重置 |
| showMask | 无 | true | boolean | 是否显示mask灰色背景， 当`false`时，maskClosable没有效果 |
| maskClosable | 无 | true | boolean | 点击mask灰色区域是否关闭弹框 |
| hiddenScroll | 无 | true | boolean | 弹框弹起时，如果body有滚动条，是否隐藏 |
| onClose | 无 | / | 函数 | 关闭时，执行的回调函数 |

## 更新说明

1. `onCancel` 换成 `onClose`;
2. 删除 `closeClassName`, 统一使用`className` 修改子元素样式；
3. 支持动态创建，当visible时，才创建， 并执行弹框动画；
4. 支持`placement`， 可以定义抽屉位置；
8. 更方便和其他组件搭配使用， 比如： `Modal`、 `Popover`、 `Select`等；

## 注意

无

