# InputNumber 数字输入框

支持 PC 和 Mobile 端

## Demo
```javascript
import { InputNumber } from 'autobest-common-ui';

export default class InputNumberDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }
  onChange = value => {
    this.setState({
      value
    });
  };
  onChangePackMultipleBefore = value => {
    console.log(value, 'before');
  };
  onChangePackMultipleAfter = value => {
    console.log(value, 'after');
  };
  render() {
    const { value } = this.state;
    return (
      <div className="demo-link-list">
        <InputNumber
          value={value}
          packMultiple={5}
          min={1}
          max={9999}
          placeholder="number"
          onChange={this.onChange}
          onChangePackMultipleBefore={this.onChangePackMultipleBefore}
          onChangePackMultipleAfter={this.onChangePackMultipleAfter}
        />
      </div>
    );
  }
}

```
## 参数说明
input number 和普通输入框没有区别，可以自定义添加focus blur等等方法或属性。

| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| className | 无 | class样式名 | input样式 |
| value | 无 | string | 输入框中的值 |
| min | 无 | number | 最小值 |
| max | 无 | number | 最大值 |
| packMultiple | 无 | number | 打包值，向上取整 |
| isPositive | true | boolean | 只能输入整数 |
| disabled | false | boolean | 输入框是否可以操作 |
| size | 3 | number | 输入框默认字符大小 |
| name | 无 | string | 输入框的别名 |
| delay | 1000 | number | 防抖时间 单位： ms |
| onChange | 必填 | function | 值修改后的回调函数，用于修改value属性 |
| onChangePackMultipleBefore | 无 | function | packMultiple 有值时，判断前的回调函数 |
| onChangePackMultipleAfter | 无 | function | packMultiple 有值时，判断后的回调函数 |


## 注意

1.该组件进行了优化，当值是`packMultiple整数`倍时，将不再执行onChangePackMultipleBefore和onChangePackMultipleAfter。

2.在有`packMultiple`属性时，输入的值是临界值或者大于临界值时，value将会等于：`valueMin = packMultiple` 和 `valueMax = value - (value % packMultiple)`

