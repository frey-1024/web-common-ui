# Skeleton 骨架屏

支持 PC 和 Mobile 端

```javascript
import { Skeleton } from 'autobest-common-ui';

const Item = Skeleton.Item;
 
export default class SkeletonDemo extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       loading: true
     };
   }
   componentDidMount() {
     setTimeout(() => {
       this.setState({
         loading: false
       });
     }, 4000);
   }
 
   render() {
     const { loading } = this.state;
     return (
       <div className="demo-collapse">
         <Skeleton
           loading={loading}
           rows={3}
           content={<Item style={{ width: '5rem', height: '.2rem', marginBottom: '.1rem' }} />}
         >
           内容区域
           <br />
           内容区域
           <br />
           内容区域
         </Skeleton>
       </div>
     );
   }
}

```

## Skeleton参数说明
| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| loading | 必填 | boolean | 是否显示骨架屏 |
| content | 必填 | node | 一条内容，配合rows一块使用 |
| rows | 1 | number | content显示次数 |
| active | true | boolean | 用于控制是否有动画|
| className | 无 | class样式名 | 元素样式 |


## Skeleton.Item 参数说明

| 属性 | 默认值 | 参数类型 | 用法说明 |
| ------ | ------ | ------ | ------ |
| style | 无 | object | 行间样式 |
| className | 无 | class样式名 | 元素样式 |

## 注意

无

