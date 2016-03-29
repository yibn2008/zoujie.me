---
Title: CSS 水平/垂直居中方法集锦
Date: 2014-05-23
---

居中是一种非常常见的CSS布局技术, 从页面的整体布局到行内文本和图片的排版, 它们适用的居中方式各不相同. 最近我在这个主题上整理了一些资料, 基本上所有常见的居中技术都齐全了, 把它们的实现方式理解之后, 在布局的时候一定会得心应手:-)

## 文本垂直居中
```css
.align-center {
  line-height: 1em;
  height: 1em;
}
```

<!--more-->

在对元素内的文本排版时, 可以设置行高(line-height)与元素高度相同, 元素中的文本会自动垂直居中, 在bootstrap中大量使用了这种技术, 比如button, dropdown等. 它的兼容所有的现代浏览器和IE6+.

## 行内元素居中

如果是对行内元素垂直居中, 可以直接使用`vertical-align: middle`, 水平居中使用`text-align: center`, 这算是CSS定义的最直接的居中方式了.

需要注意的是, **行内元素**(table-cell元素的垂直居中的行为有所不同)的垂直居中对齐的参考元素是**父元素中小写字母基线部分以上(如字母a)的中部**. 比如下图:

![vertical-align.png][1]

文本与图片在同一行, 图片默认是基线对齐, 表现起来就像是文本对齐到了图片的底部, 但应该理解成图片以文本的基线对齐, 所以要让"文本垂直居中", 实际是让"图片垂直居中". 对于上面示例而言, 图1以基线对齐, 图2以文本中部对齐.

要了解行内元素和表格中垂直居中的差异, 可以访问 http://phrogz.net/css/vertical-align/

## 块级元素水平居中

```css
.align-center {
  margin: auto; /* 正常文档流中, margin-left/margin-right会自动计算并分配相同的值 */

  width: 100px; /* 指定一个宽度后, 会有水平居中效果 */
}
```

这是最常用的水平居中方法了, 它对IE6+的浏览器都支持, 在正常的文档流中, 'auto'对margin-top和margin-bottom的值是0, 所以它对垂直居中是无效的. 如果居中元素设置了最大宽度, 则当元素超过最大宽度时会自动居中.

此水平居中方式支持**变宽**. 变宽和变高的一种实现是:
```css
.varible-size {
  display: table;
  width: auto;
  height: auto;
}
```

## 绝对定位居中 (块级元素: 水平+垂直居中)

```css
.align-center {
  position: absolute;    /* 元素跳出文档流, 相对于`position:relative`的父元素(通常是body)定位 */
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;              /* top/bottom/left/right均为0, 元素会拥有一个边界框, 并按自身大小填充相对定位的父元素 */
  margin: auto;          /* 元素的外边距会根据边界框和元素自身的大小进行计算, 并为top/bottom和left/right分配一个相同的值 */

  width: 100px;
  height: 100px;         /* 指定元素大小后, margin:auto会自动计算大小, 并保持水平/垂直居中 */
}
```

绝对定位居中, 宽度和高度值必须指定才会有居中效果, 宽度和高度可以为绝对值, 百分比和最大值(max-width/max-height). 此居中方法对**变宽**和**变高**有一定支持, 但不同的浏览器的支持表现不一样(比如火狐29可以水平居中, 但不能垂直居中; Chrome35/Safari7则相反), 不建议使用.

绝对定位居中有许多延伸的使用方法, 可以访问 http://blog.csdn.net/freshlover/article/details/11579669

兼容性: 现代浏览器 & IE8+
响应式: 支持
示例: [绝对定位居中][2]

## 负外边距居中(块级元素: 水平+垂直居中)
```css
.align-center {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -50px;
  margin-top: -50px;
  height: 100px;
  width: 100px;
}
```

由于这种方式居中有很好的兼容性, 使得它十分常见, 一般的弹出对话框(如bootstrap modal)等组件都是用这种方式定位的. 使用它的前提是要知道定位元素本身的大小, 所以这种方法一般应用在JS交互的场景中.

兼容性: 现代浏览器 & IE6+
响应式: 不支持
示例: [负外边距居中][3]

## CSS3变换居中(块级元素: 水平+垂直)
```css
.align-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

这种方式需要使用CSS3的支持, 所以对IE9以下的浏览器是不适用的. 另外, 由于变换时的渲染方式和传统布局不同, 所以有时候会出现边界模糊的情况.

兼容性: 现代浏览器
响应式: 支持
示例: [CSS3变换居中(transform)][4]

## 表格居中(块级元素: 水平+垂直)
```css
.table-center {
  display: table;
}
.table-cell {
  display: table-cell;
  vertical-align: middle;
}
.center-content {
  display: table;    /* 可变宽度的实现 */
  margin: auto;
}
```

```html
<div class="container table-center">
  <div class="table-cell">
    <div class="center-content">XXX</div>
  </div>
</div>
```

这种居中方式有两个最大的好处: 浏览器广泛兼容和宽度/高度可变. 但它需要多层HTML, 用起来会比较繁琐, 另外它相对居中的容器必须是table.

兼容性: 现代浏览器 & IE6+
响应式: 支持
示例: [表格居中][5]

## 行内块级居中(块级元素: 水平+垂直)
```css
/* This parent can be any width and height */
.inline-block-center {
  text-align: center;         /* 父容器设置文本居中对齐, 使子元素水平居中 */
}

/* The ghost, nudged to maintain perfect centering */
.inline-block-center:before {
  content: '';                /* 使伪元素有一个空格的宽度 */
  display: inline-block;      /* 使伪元素可以拥有高度 */
  height: 100%;               /* 伪元素撑满父元素 */
  vertical-align: middle;     /* 使伪元素垂直居中(默认与基线对齐) */
  margin-left: -0.25em;       /* 消除1个空格宽度的影响 */
}

/* The element to be centered, can
   also be of any width and height */
.inline-block-content {
  display: inline-block;
  vertical-align: middle;     /* 当前父元素的文本基线对齐 */

  height: 50%;                /* 注意, 文本的宽/高度不能超过外框的宽/高度 */
}
```

相对于前面的表格居中, 使用内行元素居中能减少使用的标签, 并同样支持变宽和变高, 但它不支持IE8以下的浏览器.

这种居中方法使用一点HACK技术. 前面提到过, 行内元素的垂直居中`vertical-align:middle`是相对于父元素的文本中部对齐的, 这里使用了一个高度为100%的伪元素`:before`, 它的作用就是利用这个对齐的特性将文本对齐到父元素的中部, 此时, 由于行内元素在垂直居中的作用下, 也相对文本的中部对齐, 所以就有了相对父元素垂直居中的效果. 如图:

![inline-center.png][6]

但正是由于这个HACK的原因, 要保证行内元素居中, 它的高度就不能超过100%的伪元素. 同样, 由于有伪元素的存在, 行内元素的宽度如果超过100%也会被它挤出父元素.

兼容性: 现代浏览器 & IE8+
响应式: 支持
示例: [行内块级元素居中][7]

参考文章:

 1. http://blog.csdn.net/freshlover/article/details/11579669
 2. http://coding.smashingmagazine.com/2013/08/09/absolute-horizontal-vertical-centering-css/
 3. http://css-tricks.com/centering-in-the-unknown/
 4. https://www.cs.tut.fi/~jkorpela/chars/spaces.html
 5. https://www.cs.tut.fi/~jkorpela/styles/spaces.html
 6. http://phrogz.net/css/vertical-align/


  [1]: /blog/images/2014/05/807113180.png
  [2]: /demo/center/absolute.html#absolute-center
  [3]: /demo/center/absolute.html#negative-margin
  [4]: /demo/center/absolute.html#transform-center
  [5]: /demo/center/absolute.html#table-center
  [6]: /blog/images/2014/05/24579155.png
  [7]: /demo/center/absolute.html#inline-block-center
  
