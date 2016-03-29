---
Title: "AngularUI Boostrap: 为自定义popover添加双向绑定"
Date: 2014-04-19
---

最近在使用AngularUI Bootstrap时, 有一个自定义指令popoverConfirm的需求. 这个popoverConfirm指令类似于popover, 实现的功能就是当用户点击某个按钮/链接时, 会弹出popoverConfirm确认框, 上面有"确定"和"取消"两个按钮, 当用户点击这两个按钮时, 会触发不同的操作.

如果使用传统的jQuery开发, 只需要绑定事件就可以搞定. 但这里要使用Angular的方式: 通过指令的属性来实现双向绑定(two way binding). 理想的情况是这样的:

``` html
<script>
function Controller($scope) {
  $scope.whenOK = function () {
    // delete something ...
  };
}
</script>
...
<div ng-controller="Controller">
<button type="button" popover-confirm="I'm a popover" popover-confirm-ok="whenOK()">删除</button>
</div>
```

当用户点击**删除**按钮之后, 会弹出一个确认框, 用户点击**确定**后会调用`whenOK`函数. 但在研究了popover的内部实现之后, 发现事情没有那么简单.


<!--more-->


## popover指令的实现

popover指令与传统的模板指令有点不同, 因为它的功能是当被绑定元素O被点击(或其它事件)时, 会出现一个弹出框, 但元素O并没有被因模板替换而改变.

AngularUI Bootstrap使用了两层指令来实现这个效果, 第一层指令是popover, 第二层指令是popoverPopup. 其中, popover用于对外绑定, 如`<button popover ...`; popoverPopup则用于处理popover弹出框的展现逻辑. 两层指令的scope如图:

![ngui-tooltip.png][1]

可以看出, 在popover指令中, scope为true, 表示继承至外层scope(可能来自于controller或其它指令), 但popoverPopup的scope是独立的, 只能通过在popover的模板来绑定scope属性或函数. 那要如何才能实现将外层scope的属性/函数绑定传递到最popoverPopup中的独立scope呢?

先看看popover指令的实现代码:

```javascript
angular.module( 'ui.bootstrap.popover', [ 'ui.bootstrap.tooltip' ] )

.directive( 'popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover.html'
  };
})

.directive( 'popover', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'popover', 'popover', 'click' );
}]);
```

可以看出, 默认的popoverPopup没有任务事件处理逻辑, 只是作模板替换之用. popover由`$tooltip`函数实现, 这里传入的三个参数分别是type, prefix, defaultTriggerShow.

再深入到`$tooltip`的实现:

```javascript
...
var template =
  '<div '+ directiveName +'-popup '+
    'title="'+startSym+'tt_title'+endSym+'" '+
    'content="'+startSym+'tt_content'+endSym+'" '+
    'placement="'+startSym+'tt_placement'+endSym+'" '+
    'animation="tt_animation" '+
    'is-open="tt_isOpen"'+
    '>'+
  '</div>';

return {
  restrict: 'EA',
  scope: true,
  compile: function (tElem, tAttrs) {
    var tooltipLinker = $compile( template );
...
```

在生成模板的时候, 可以看到popover的模板是静态的, 只能传递有限的如title/content/placement等参数. 

## 解决方案: 动态模板

如果想在外层调用popover时绑定自定义的属性/函数, 就必须修改模板, 让它动态的支持外层scope到popoverPopup的双向绑定. 嗯, 就这么干, 先通过tAttrs获取属性列表, 将以prefix为前缀的属性添加到模板中:

```javascript
...
return {
  restrict: 'EA',
  scope: true,
  compile: function (tElem, tAttrs) {
    // map attributes to template
    var prefixLen = prefix.length;
    var fnAttrs = [];
    for (var a in tAttrs) {
      if (a.indexOf(prefix) === 0 && a.length > prefixLen) {
        fnAttrs.push(snake_case(a.substring(prefixLen)) + '="' + tAttrs[a] + '"');
      }
    }
    var template =
      '<div '+ directiveName +'-popup '+
        'title="'+startSym+'tt_title'+endSym+'" '+
        'content="'+startSym+'tt_content'+endSym+'" '+
        'placement="'+startSym+'tt_placement'+endSym+'" '+
        'animation="tt_animation" '+
        'is-open="tt_isOpen" '+
        fnAttrs.join(' ') +
        '>'+
      '</div>';

    var tooltipLinker = $compile( template );
...
```

我已向AngularUI Bootstrap团队提交了一个pull request, 会不会被合并就不知道啦~ 附上patch的地址: https://github.com/yibn2008/bootstrap/tree/patch-1


  [1]: /blog/images/2014/04/1299977895.png
