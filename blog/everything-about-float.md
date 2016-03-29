浮动是一个简单的东西, 浮动是一个复杂的东西. 虽然以一种很装逼的口吻说了出来, 但确实是如此(CSS里的好多东西都如此). 

浮动最初是在CSS1中提出来的, 用于图片或者段落的绕排, 你可以经常在报纸或博客中看到文章正文在左侧(或右侧)引用图片或者小故事, 这就是浮动的最初的应用场景. 后来, 因为table布局标签嵌套层次过多, 布局与HTML标签高度耦合, 就被后来流行的"DIV+CSS布局"取代, 其中float就是这种布局技术的关键. 当然, 现在的布局技术一般都使用的是栅格系统, 比如Bootstrap, Fundation等.

![float-layout.png][1]

float有四个值, `float: left|right|none|inherit`, inherit表明这个属性可以继承.


<!--more-->


## 浮动的几个特点

1. 任何元素浮动之后, 都会成为块级元素(block), 但它的宽度以其内容的宽度为标准.

2. 浮动元素相对直接父元素浮动, 它的边界不会超过父元素的左/右/上边界, 但可能会超过下边界(即父元素会塌陷).

3. 浮动元素会跳出正常的文档流, 但它不会与其它元素重叠. 浮动元素会尽量在浮动的相反方向上挤出排在它后面的非浮动元素, 如果没有足够宽度, 这些非浮动元素就排在浮动元素的下面.

4. 多个浮动元素之间按DOM中的的顺序和浮动方向相互堆砌. 具体的规则是, 浮动元素依照它们在DOM中的顺序浮动, 如果上一个浮动元素没有留出足够的空间, 就在它的下面重新排布, 从而保证所有的元素不会重叠. 此外, 如果浮动元素是有外边距的, 那么**外边距依然有效并且不会重叠**. 如图([示例: 浮动元素的堆砌][2]):

  ![float-stack.png][3]

5. 如果浮动元素排在同一行, 它们"尽量"保持顶端对齐. 这时的尽量是指当有其它非浮动元素存在时, 后面的浮动元素会排在它们下面, 如果去掉这些元素, 那么浮动元素的顶端是对齐的. 如图([示例: 浮动元素顶端对齐][4]):

  ![QQ20140614-1.png][5]

  实际上, 如果一个浮动元素的前面有其它非浮动元素, 那么它的顶端也是不能超过这些元素的顶端. 这个规则实际也很简单, 就是**浮动元素的不可能超越它前面的元素往上浮动**. 这个规则在CSS权威指南中讲了很多种情况, 但实际上只用这样理解就可以了.

6. 对浮动元素设置负外边距, 或者其宽度超过父元素时, 浮动元素可能会与其它正常元素重叠. 此时, 对于行内元素和块级元素中的内容, 会在浮动元素之上显示, 而块级元素的背景和边框则会显示在浮动元素的下方, 如图([示例: 浮动元素的重叠][6]):

  ![QQ20140614-2.png][7]

## 浮动布局技术

在了解了浮动的一些特性之后, 我们来看一下常用的浮动布局技术

### 两栏布局([示例][8])

一般两栏布局有两种情况: A. 侧边栏在左, B. 侧边栏在右.

![1402743096416.png][9]

设有如下HTML:

```html
<div class="container">
  <div class="sidebar">Sidebar</div>
  <div class="content">Content</div>
</div>
```

对于情况A, 可以使用如下样式:

```CSS
.sidebar {
  float: left;
  width: 300px;
}
.content {
  margin-left: 310px;
}
```

对于情况B, 可以使用如下样式:

```CSS
.sidebar {
  float: right;
  width: 300px;
}
.content {
  margin-right: 310px;
}
```

这种布局方式可以保证非浮动的content宽度能够跟随container变化, 是一种流式布局. 这种两种布局方式还能够使用相对定位来实现, 比如, 对于情况A来说:

```CSS
.container {
  position: relative;    // 创建定位容器
}
.sidebar {
  position: absolute;
  width: 300px;
}
.content {
  margin-left: 310px;
}
```

不过使用position来创建两栏布局一般很少用到, 因为对.container设置了相对定位, 这会对其它潜在的使用绝对定位子元素造成影响; 另外, 由于float有其它元素不重叠的特点, 当浮动元素大小变化时, 会触发其它元素的重绘, 如下图:

![1402754639635.png][10]

但使用相对定位布局的元素是不会触发重绘的:

![1402754652612.png][11]

### 三栏/多栏布局([多栏布局][12])

三栏或多栏布局, 和两栏布局的原理类似. 有如下HTML:

```HTML
<div class="container">
  <div class="sidebar1">Sidebar 1</div>
  <div class="sidebar2">Sidebar 2</div>
  <div class="content">Content</div>
</div>
```

要实现如下的布局:

![1402754046235.png][13]

样式表可以为:

```CSS
.content {
  margin-left: 310px;
  margin-right: 310px;
}
.sidebar1 {
  float: left;
  width: 300px;
}
.sidebar2 {
  float: right;
  width: 300px;
}
```

对于3栏以上的布局是类似的, 只要为浮动的边栏设置宽度, 根据浮动元素堆砌的特点就可以实现N栏布局.

### 栅格系统

TODO ...

## 清除浮动技术

在使用浮动时, 由于浮动元素跳出文档流的特点, 使得父元素的高度无法跟随其内容的变化而变化, 典型的如下图:

![collapse.png][14]

这个时候就需要清除浮动的技术了.

### 使用"挡板"元素(空div)清除

就是使用一个空的块级元素"挡"在浮动元素后面, 并对此元素设置`clear: both`, 这样父级元素就和它的内容一样高了.

```HTML
<div class="container">
  <div class="float">Float Left</div>
  <div class="float">Float Left</div>
  <div class="float">Float Left</div>
  <div class="float">Float Left</div>
  <div style="clear: both"></div>
</div>
```

这种方法在早期被经常使用, 因为它除了加上一个额外的div之外, 没有任何其它的副作用, 并且浏览器兼容性好.

### 使用overflow清除

对元素设置`overflow: hidden`也可以实现清除浮动的效果:

```CSS
.clearfix {
  overflow: hidden;
  width: 100%;
}
```

其中, overflow可以为auto值, 但这样写可能导致滚动条的出现, 所以通常写为hidden. 另外, 这里width的作用是e用于触发IE的"hasLayout".

使用overflow的缺点是可能导致潜在的"溢出"元素被清楚, 比如在做多级导航时, 需要菜单超出父元素展示, 此时就不能使用overflow清除浮动. 另外, 有box-shadow效果的元素也可能会被`overflow: hidden`清除.

### 使用伪元素清除

在伪元素得到广泛支持之后, 可以对"挡板"元素清除做一些改进: 使用伪元素代替空div来清除浮动:

```CSS
.clearfix:after {
  content: ' ';
  display: block;
  clear: both;
}
```

这种清除浮动的方法已经被广泛应用到各种CSS框架里了, 在bootstrap中可以看到它提供的助手类`.clearfix`就是使用这种方法.

## 浮动相关的问题

在IE6/7中, 浮动可能会出现一些奇怪的bug(太正常了), 这时列出常见的bug:

1. IE6中, 浮动元素有一个双边距的bug, 即在浮动方向上, 元素的外边距会是原来的两倍, 这可以通过设置`display: inline`来解决. 虽然明确的指定了以行内元素的方式显示, 但浏览器仍然会把元素当作块级元素来看待, 所以这种方法是没有副作用的. 关于双边距bug, 可以查看 http://www.cssnewbie.com/double-margin-float-bug/

2. 3像素bug. IE6中当文本与浮动相邻时, 会被神奇的踢开3个像素, 这时只要给文本设置一下宽度或高度就可以了

3. 在IE7中, 如果浮动的父元素有浮动的子元素, 当这些子元素的margin-bottom会被父元素忽略, 这时可以使用padding-bottom代理margin-bottom来解决此问题.

参考资料:

1. CSS权威指南
2. http://css-tricks.com/all-about-floats/
3. http://www.quirksmode.org/css/clearing.html


  [1]: ./images/2014/06/4183589994.png
  [2]: /demo/float/float-stack.html
  [3]: ./images/2014/06/2839269747.png
  [4]: /demo/float/float-top.html
  [5]: ./images/2014/06/3506825155.png
  [6]: /demo/float/float-overlap.html
  [7]: ./images/2014/06/1511352686.png
  [8]: /demo/float/two-column-layout.html
  [9]: ./images/2014/06/1851919864.png
  [10]: ./images/2014/06/1739454750.png
  [11]: ./images/2014/06/3132709506.png
  [12]: /demo/float/multi-column-layout.html
  [13]: ./images/2014/06/3140447095.png
  [14]: ./images/2014/06/185452731.png
