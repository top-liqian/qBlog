# echart相关的面试题

## 1. 如何实现echart的按需引用

```js
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
 
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
```

## 2. 如何获取屏幕的缩放比例

window.screen

## 3. 监听屏幕缩放

window.onresize;document.addEvventListener('resize',()=>{})

## 4. 切换其他统计图时，出现卡顿或者数据还存在的问题,怎么办？

把返回的数据清空

销毁这个统计图的资源

clear()方法则是清空图例数据，不影响图例的resize，而且能够释放内存

beforeDestroy () {this.chart.clear()},

## 5. 什么原因会造成legend图例不显示

在legend中的data为一个数组项,数组项通常为一个字符串，每一项需要对应一个系列的 name,如果数组项的值与name不相符则图例不会显示;

## 5. 图表位置无法紧贴画布边缘的问题，怎么解决

在grid绘图网格里,containLabel(grid 区域是否包含坐标轴的刻度标签,默认不包含)为true的情况下,无法使图表紧贴着画布显示,但可以防止标签标签长度动态变化时溢出容器或者覆盖其他组件,将containLabel设置为false即可解决;


## 6. html2canvas

有2种模式，一种是利用foreignObject，一种是纯canvas绘制

1.foreignObject到canvas

步骤：

1.把要截图的dom克隆一份，过程中把getComputedStyle附上style

2.放到svg的foreignObject中

3.把svg序列化成img的src(SVG直接内联)：

img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));

4.ctx.drawImage(img, ....)

2.纯canvas

步骤：

1.把要截图的dom克隆一份，过程中把getComputedStyle附上style

2.把克隆的dom转成类似VirtualDom的对象

3.递归这个对象，根据父子关系、层叠关系来计算出一个renderQueue

4.每个renderQueue Item都是一个虚拟dom对象，根据之前getComputedStyle得到的style信息，调用ctx的各种方法

总结：

性能：如果文本多，节点少，svg foreignObject的方式往往性能更高；文本少，节点多的时候，canvas反而性能更高

准确性：纯canvas方式往往更准确的还原dom的表现；svg foreignObject在比较复杂的情况下会出现截图不准确的问题

综上所述，建议使用纯canvas方式，但是注意要对文本进行限流