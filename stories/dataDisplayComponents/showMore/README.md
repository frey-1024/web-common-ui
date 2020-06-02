# Show More 文本截断组件

支持 PC 和 Mobile 端

## Demo
```javascript
import { ShowMore } from 'autobest-common-ui';

export default class ShowMoreDemo extends React.Component {
  onAfterChange = () => {
    console.log('已展开');
  };
  render() {
    return (
      <div className="demo-show-more" style={{ width: '200px' }}>
        <ShowMore lines={2} ellipsisText="Show More" onAfterChange={this.onAfterChange}
          title="AB(LTG,M3L,MYA); AB(LCV,MYA); AB(LTG,M3L,MYA), AB(LCV,MYA), AB(LCV,MYA)">
          AB(LTG,M3L,MYA); AB(LCV,MYA); AB(LTG,M3L,MYA), AB(LCV,MYA), AB(LCV,MYA)
        </ShowMore>
      </div>
    );
  }
}
```
## 参数说明

| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| children | 无 | node/string | 需要显示的文本 |
| ellipsisText | Show More | string | 省略按钮文字 |
| className | 无 | class样式名 | 整体样式 |
| ellipsisClassName | 无 | class样式名 | 省略按钮样式， 注意不能加padding样式， 可以通过空格来解决左右间距问题 |
| lines | 2 | number | 初始时，显示的行数 |
| width | 0 | number | 定义内容宽度，单位：px，建议尽量不要使用此属性，当不使用时，根据父元素进行判断 |
| onAfterChange | 无 | 函数 | 点击展开后的回调函数 |
| title | 无 | string | title属性 |
| expandable | true | bool | 是否有点击展开的效果，此时ellipsisText需要不为空，ellipsisText是点击的文字 |


## 注意

文字超出范围会带省略号

ellipsisText 不能使用标签，只支持文本

children 支持标签，但是尽量不要套用标签，因为有标签也会`过滤掉`，并计算文本内容

