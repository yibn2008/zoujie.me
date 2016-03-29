---
Title: 创建平滑的AngularJS应用
Date: 2014-04-12
---

在创建AngularJS(以下称NG)应用时, 由于NG渲染模板会有一定延迟, 所以经常会出来NG的标签很突兀的展现出来, 理想的情况应该是展示一个"正在加载 ..."的提示, 或者一个表示loading的gif图标.


<!--more-->

## 隐藏文本模板 ##

比如这段HTML代码, 在NG未完全渲染好时, 会直接显示`{{num}}`.

```
<h2>图书列表 <small>一共有 {{num}} 本书</small></h2>
```

这里, 可以使用`ng-bind`属性绑定文本模板, 属性值是作用域变量名. 如果文本中含有HTML标签, 需要使用`ng-bind-html`.

```
<script type="text/javascript">
function Controller($scope) {
  $scope.text = '一共有 2 本书'
  $scope.text = '一共有 <strong>2</strong> 本书';
}
</script>
<h2>图书列表 <small ng-bind="text"></small></h2>
<h2>图书列表 <small ng-bind-html="html"></small></h2>
```

不过这种方式需要在$scope中创建变量, 更加完美的方式是使用`ng-bind-template`.

```
<h2>图书列表 <small ng-bind-template="一共有 {{num}} 本书"></small></h2>
```

除了使用`ng-bind*`之外, 也可以使用`ng-cloak`隐藏, 下面就会讲到.

## 隐藏HTML模板 ##

实际中, 比如有一个图书列表, 使用了`ng-repeat`指令, 默认的, 这个指令的模板会显示出来直到NG渲染完成. 此时如果需要隐藏模板, 就需要`ng-cloak`了. cloak在英文中, 是斗篷的意思.

使用`ng-cloak`之前, 需要引入angular-csp.css或都在你的公共CSS文件中添加以下代码:

```
[ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
  display: none !important;
}
```

`ng-cloak`的工作原理很简单, 在加载页面时, 所有`ng-cloak`元素会隐藏掉, 当NG完成模板的渲染时, 会将`ng-cloak`属性删除.

## 显示loading信息 ##

如果直接隐藏模板, 只是光突突的显示一片空白在页面上. 更好的方式应该是在空白处有一段loading的gif或"加载中 ...".

如果使用的是指令, 并且指令不需要transclude HTML模板时, 可以在指令中直接添加loading文本. 但这时没有使用`ng-cloak`的必要, 也不能使用.

```
<div directive-no-transclude><i class="icon-loading"></i> 加载中 ...</div>
```

但是这种方法不能用于需要HTML模板的指令. 目前, NG里还没有指定类似`ng-loading`这样的指令, 在未渲染完成时显示状态, 完成后就隐藏或删除. 不过, NG有`ng-hide`指令, 根据`ng-cloak`的原理, 可以简单实现加载后隐藏loading文本.

```
<p ng-hide="true"><i class="icon-loading"></i> 加载中 ...</p>
<div some-directive ng-cloak>...</div>
```

这段代码中, p使用`ng-hide=true`, 由于在模板渲染完成时, `ng-hide`会被执行, 它的值为true, 所以就自然的隐藏了. 另外, ng-hide也需要angular-csp.css的支持, 或者, 你可以手动在公共的CSS文件中添加:

```
.ng-hide {
  display: none !important;
}
```

或者, 如果你不想在DOM留下加载信息的痕迹, 可以来点更绝的, 自定义一个会自我销毁的指令.

```
angular.module('SomeModule', []).directive('loadingText', function () {
  return {
    restrict: 'E',
    link: function (scope, elem, attrs) {
      if ('removeSelf' in attrs) {
        elem.remove();
      } else {
        elem.css('display', 'none');
      }
    }
  };
});
...
<loading-text remove-self><i class="icon-loading"></i> 加载中 ...</loading-text>
```

嗯, 现在应该完美了.
