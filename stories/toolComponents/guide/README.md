# Guide 添加遮罩层，高亮children

支持 PC 和 Mobile 端

## Demo
```javascript
import { Guide } from 'autobest-common-ui';

export default class GuideDemo extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
     visible: false
      };
    }
    
    onOpen = () => {
    this.setState({ visible: true });
    };
    
    onChangeVisible = visible => {
    this.setState({ visible });
    };
    
    render() {
    const { visible } = this.state;
    return (
     <div className="guide-demo">
       <Guide visible={visible} onChangeVisible={this.onChangeVisible}>
         <input className="input" placeholder="请输入" />
       </Guide>
       <button className="btn" onClick={this.onOpen}>
         提交
       </button>
     </div>
    );
    }
}
```

## 参数说明

| 属性 | 默认值 | 是否必填 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ | ------ |
| visible |  | 是 | boolean | 是否显示遮罩层 |
| onChangeVisible |  | 是 | function | 改变visible状态的函数，参数为visible |
| expires | 3000 | 否 | number | 遮罩层显示的时间（一段时间后自动隐藏） |
| loadablePointer | false | 否 | boolean | 是否显示带箭头的图片，图片默认显示在子元素上方，水平居中 |
| img | https://assets-web.dev.autobestdevops.com/common-ui/images/vehicle_pointer.png | 否 | string | 图片路径 |
| position | center | 否 | string | 图片默认显示在子元素上方，水平居中,可选 left、center、right |
| translateX | 0 | 否 | number | 图片水平偏移量， 单位px |
| translateY | 0 | 否 | number | 图片垂直偏移量， 单位px |
