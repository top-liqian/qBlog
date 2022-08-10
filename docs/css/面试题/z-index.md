# z-index的相关面试题

## 一、父子级z-index层级关系

1. 当父元素设置了z-index,无论子元素设多小都会浮在父元素上面
2. 父元素的z-index >= 兄弟组件的z-index， 子元素z-index比父元素同级组件高，会浮在所有元素上面
3. 父元素的z-index < 兄弟组件的z-index, 子元素z-index无论多高都会在最下面