# Modal 组件

支持 PC 和 Mobile 端

## 引入方式
```javascript
import { Modal } from 'autobest-common-ui';
```

## 使用方式

```javascript
export default class ModalDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  
  onCloseModal = () => {
    this.setState({
      visible: false
    });
  };
  onOpenModal = () => {
    this.setState({
      visible: true
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <div className="demo-modal">
        <button onClick={this.onOpenModal}>打开按钮</button>
        <Modal
          visible={visible}
          placement="top"
          top="0.3rem"
          height="47%"
          onClose={this.onCloseModal}
        >
          modal content
        </Modal>
      </div>
    );
  }
}
```
## 参数说明

| 属性 | 必传 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ | ------ |
| visible | 是 | false | boolean | 用于控制浮层显隐 |
| title | 非 | 空 | node | 弹出框title |
| className | 非 | 无 | class样式名 | 弹框主体样式 |
| name | 非 | 空 | string | 回调函数第二个参数， 用于标识当前弹框 |
| placement | 非 | center | string | 弹框位置包括：'**center**' 和 '**top**'， 当是top时， top 的属性才有作用 |
| top | 非 | 10% | string | 弹框到顶部距离（只有在placement="top"时，有作用） |
| width | 非 | 6.5rem | string | 弹框宽度， 当写成`auto`时， 宽度是全屏 |
| height | 非 | auto | string | 弹框高度 |
| closable | 非 | true | boolean | 弹框是否显示右上角关闭按钮 |
| maskClosable | 非 | true | boolean | 点击mask灰色区域是否关闭弹框 |
| hiddenScroll | 非 | true | boolean | 弹框弹起时，如果body有滚动条，是否隐藏 |
| onClose | 非 | / | 函数 | 点击右上角关闭按钮，执行的回调函数 |
| onOpened | 非 | / | 函数 | 弹框弹出后，执行的回调函数 |
| onDestroy | 非 | / | 函数 | 弹框关闭后，执行的回调函数 |
| popupLimitSpacing | 非 | 14 | number | 弹框到边界的间距 |

## 更新说明

1. `onCancel` 换成 `onClose`;
2. 删除 `closeClassName`, 统一使用`className` 修改子元素样式；
3. 加入 `popupLimitSpacing`， 可以定义弹框到屏幕的距离；
4. 删除 `isMobile`, 当移动端时，宽度为 `100vw - .3rem`;
5. 支持屏幕缩放和滚动；
6. 支持动态创建，当visible时，才创建， 并执行弹框动画；
7. 更方便和其他组件搭配使用， 比如： `Drawer`、 `Popover`、 `Select`等；

## 注意

此组件是一个空白弹框组件，样式几乎没有，内容和样式需要根据情况进行填充（原因：因为发现每个弹框的样式都不同，为了更加灵活，可以在此组件基础上定制新的UI弹框）。
