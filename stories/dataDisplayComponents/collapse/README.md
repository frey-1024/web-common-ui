# Collapse 折叠面板组件

支持 PC 和 Mobile 端

## 引入方式
```javascript
import { Collapse } from 'autobest-common-ui';
```
## 使用方式

```javascript
export default class CollapseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: []
    };
  }
  onVisibleChange = () => {
    this.setState({
      visible: !this.state.visible
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <div className="demo-collapse">
        <Collapse
          title={<strong>点击此处</strong>}
          visible={visible}
          onChange={this.onVisibleChange}
        >
          1折叠的内容区域
          <br />
          2折叠的内容区域
          <br />
          3折叠的内容区域
          <br />
          4折叠的内容区域
        </Collapse>
      </div>
    );
  }
}

```

## 参数说明

| 属性 | 必传 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------  | ------ | ------ | ------ |
| title | 非 | 无 | 需要是 element元素 | 展开按钮 |
| className | 非 | 无 | class样式名 | 展开内容主题样式重置 |
| name | 非 | 空 | string | 回调函数第二个参数， 用于标识当前弹框 |
| visible | 非 | false | boolean | 用于控制是否展开和隐藏 |
| appear | 非 | true | boolean | 先创建，但是display为none, 支持服务端渲染 |
| mountOnEnter | 非 | false | boolean | 动态创建 |
| onChange | 非 | 无 | function | 改变时的回调函数 |
| onEntered | 非 | 无 | function | 展开后的回调函数 |
| onExited | 非 | 无 | function | 收缩后的回调函数 |

## 更新说明

1. `visible` 可以不传，内部进行切换;
2. `appear` 默认支持服务端渲染；
3. 加入 `onEntered` 和 `onExited`；
4. `onChange` 不用写在title上；

## 注意

`title` 需要是HTML元素

