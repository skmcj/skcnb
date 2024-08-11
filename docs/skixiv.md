## skixiv主题

这是一个二次元风格的皮肤

### 功能介绍

- 界面美观简洁
  - 文章列表展示合理化，如编辑按钮(只在博客作者页面会展示)
  - 置顶文章与普通文章的区分
- 社交信息展示
- 界面阅读进度提示
- 明暗主题切换
- 消息提示
  - 用原生Js封装了一个消息组件
  - 对部分接口重新封装，请求结果采用消息组件提示
- 相册预览
  - 重写了一个图片预览器，目前只用在相册页
  - 支持更现代的图片预览方式，如提供放缩旋转等操作
- 评论优化(重新封装了评论管理器)
  - 支持评论后立即加载最新评论
  - 操作评论时提供消息提示
  - 评论支持显示头像
- 资源库(具体看下侧资源库栏目)
  - 图片资源
  - 词句资源
- 友链
  - 可灵活设置友链，具体看下侧友链栏目
- 打赏
  - 详情可看下侧打赏栏目

### 资源库

如未设置，主题场景可能出错

资源库作用主要是提供主题部分场景默认选中需要，如：

- 默认文章详情页会展示文章所设题图，当文章未设题图时，从资源库随机抽取
- 页面默认会展示页面标题的词句，如某些页面如默认标题(如首页)，这从资源库抽取

总之，资源库就是为了主题某些场景需展示图片、词句等，当未设置时，提供随机选取展示

#### 图片资源

主要为一个`coverList.json`文件，内容参考如下：

```js
parseCover([
    "https://images-cdn.example.com/cover-one.webp",
    "https://images-cdn.example.com/cover-two.webp",
    "https://images-cdn.example.com/cover-three.webp"
])
```

是一个不合法的`json`文件(原因后续阐明)，形式为`parseCover([])`，数组内放一些图片(直链)资源

当主题需要展示图片但没有主动设置的图片可展示时，就会从该列表内随机抽取；首页封面也会从该列表内抽取，目前是`daily`模式，即每日展示一张

#### 词句资源

为一个`signList.json`文件，内容参考如下：

```js
parseSign([
    "三思而后行",
    "逸一时，误一世",
    "这个地方的人们，就是我战斗的理由",
    "最遗憾的事情莫过于，我喜欢上你之后你不再喜欢我了",
    "人生三大错觉，我能反杀，下一发能出金，她喜欢我",
    "欲买桂花同载酒，终不似，少年游"
])
```

形式为`parseSign([])`，数组内放一些词句资源

当主题场景需要展示词句时，就会从该列表随机抽取，如：首页

#### 部署

准备好上侧两个文件后，将其上传到自己的**博客园**后台文件模块，如下：

![1723369258836](https://static.ltgcm.top/md/20240811185438.webp)

在主题加载过程中，会发送请求，获取到上侧文件内的列表内容，供主题场景使用

> 由于文件域名与博客域名不一致，请求存在跨域问题
>
> 故使用`jsonp`方式请求，以绕过跨域，`parseCover`其实就是与脚本约定的回调函数名，本身没什么意义，只是为了满足`jsonp`需要
>
> 请求地址即为文件下载地址，使用`get`请求，能够直接获取到文件内容，即`parseCover([])`，由于`jsonp`请求时设置的回调函数名也为`parseCover`，故最终即可获得列表内的内容
>
> `jsonp`是一项需要前后端配合的技术，但我们没有后端，故只能通过写死在文件内的方式

### 友链

可用于展示好友博客

#### 第一步

需创建一篇文章，同时设置其`Slug`友好地址名为`~Flinks`

![1723370508822](https://static.ltgcm.top/md/20240811204606.webp)

#### 第二步

按一定规则，添加内容，有如下模块可供选择添加

##### 推荐博客

可参考：

````markdown
<div id="skPFLinks">
<h2>推荐博客</h2>

```json
[{
    "url": "https://www.cnblogs.com/skmcj",
    "site": "一包妙脆角",
    "name": "深坑妙脆角",
    "desc": "梦想是做条咸鱼",
    "avatar": "https://images-cdn.example.com/avatar.png",
    "color": "#5aa4ae",
    "page": "https://images-cdn.example.com/blog-page.webp",
    "label": "技术"
}]
```

</div>
````

上侧内容会以如下形式渲染

![1723370907472](https://static.ltgcm.top/md/20240811205254.webp)

`h2`内容为定义标题，这里为推荐博客

在`json`代码块内为列表数据，有多个时，按顺序将数据对象添加在列表内即可

> 注意：代码块前后的空行不能省略，否则解析可能出错
>
> `div`的`id`不能写错，其是功能的数据提取锚点

##### 小伙伴们

````markdown
<div id="skFLinks">
<h2>小伙伴们~</h2>

```json
[{
    "url": "https://www.cnblogs.com/skmcj",
    "site": "一包妙脆角",
    "name": "深坑妙脆角",
    "desc": "梦想是做条咸鱼",
    "avatar": "https://images-cdn.example.com/avatar.png",
    "color": "#5aa4ae",
    "page": "https://images-cdn.example.com/blog-page.webp",
    "label": "技术"
},{
    "url": "https://www.cnblogs.com/skmcj",
    "site": "一包妙脆角",
    "name": "深坑妙脆角",
    "desc": "梦想是做条咸鱼",
    "avatar": "https://images-cdn.example.com/avatar.png",
    "color": "#5aa4ae",
    "page": "https://images-cdn.example.com/blog-page.webp",
    "label": "技术"
}]
```

</div>
````

上侧内容会以如下形式渲染

![1723371329858](https://static.ltgcm.top/md/20240811185525.webp)

##### 申请方式

提供申请方式的说明，内容可参考如下(某些地方可自定义)：

````markdown
<div id="skLinkFormat">
<h2>申请方式</h2>
<p>如果你也想与我交换友链，可以在底下按如下格式评论或留言你的信息哟ヾ(ｏ･ω･)ﾉ</p>

```json
{
    "url": "网址",
    "site": "网站名称",
    "name": "昵称",
    "desc": "(可选)简短描述",
    "avatar": "(可选)一张图片",
    "color": "(可选)主题色",
    "page": "(可选)站点截图",
    "label": "(可选)标签"
}
```

</div>
````

上侧内容会以如下形式渲染

![1723371444581](https://static.ltgcm.top/md/20240811185425.webp)

##### 我的友链

提供自己的友链数据格式，可提供多种格式的，供朋友快速复制，参考如下：

````markdown
<div id="skSelfLink">
<h2>我的友链</h2>

```json
{
    "url": "https://www.cnblogs.com/skmcj",
    "site": "一包妙脆角",
    "name": "深坑妙脆角",
    "desc": "梦想是做条咸鱼",
    "avatar": "https://images-cdn.example.com/avatar.png",
    "color": "#68be8d",
    "page": "https://images-cdn.example.com/blog-page.webp",
    "label": "技术"
}
```

```yaml
- url: https://www.cnblogs.com/skmcj
  site: 一包妙脆角
  name: 深坑妙脆角
  desc: 梦想是做条咸鱼
  avatar: https://images-cdn.example.com/avatar.png
  color: '#68be8d'
  page: https://images-cdn.example.com/blog-page.webp
  label: 技术
```

</div>
````

上侧内容会以如下形式渲染

![1723371462671](https://static.ltgcm.top/md/20240811185422.webp)

多种形式以代码块的方式依次书写(中间至少隔一行)，最终会切换为一个多`tab`可切换的栏目

##### 友链弹幕

当你的友链数据足够多(少的话效果不好且容易出错)的时候，可以选择添加**友链弹幕**模块，只需添加如下内容：

```markdown
<div id="skLinksCast">
    <h2>友链弹幕</h2>
    <p>缘神，启动~(=^•ω•^=)</p>
</div>
```

上侧内容会以如下形式渲染

![1723372175827](https://static.ltgcm.top/md/20240811205241.webp)

最终会获取全部友链数据(包含推荐博客及小伙伴模块的内容)，以横线流动的弹幕展示，效果如上侧

> 该页面一共提供了`5`个模块可供选择装配，分别为：推荐博客、小伙伴。申请方式、我的友链、友链弹幕
>
> 按如上教程，将对应模块的内容添加到创建的友链文章内，顺序随意，添加指定模块即可渲染出指定内容

### 打赏

创建打赏页，会在文章详情底下添加投喂入口，点击即可进入

#### 第一步

需创建一篇文章，同时设置其`Slug`友好地址名为`~Reward`

![1723372763707](https://static.ltgcm.top/md/20240811205123.webp)

#### 第二步

添加内容，与书写文章一致，主要内容就是提供自己的投喂二维码

为了样式美化，提供了一些可选择类名

- `sk-ctitle` — 标题
- `sk-flex` — 弹性盒子
- `sk-flex-center` — 给弹性盒子添加居中属性
- `sk-flex-col` — 给弹性盒子添加垂直排列属性
- `sk-qr` — 投喂二维码样式
  - `sk-qr-inner` — 二维码内容
  - `sk-qr-title` — 二维码标题

内容可参考如下：

```markdown
<!-- 标题 -->
<div class="sk-ctitle">
  <i class="ib-money"></i>
  <span>投喂</span>
  <i class="ib-money"></i>
</div>
<!-- 具体内容 -->
<div class="sk-reward sk-flex sk-flex-center">
  <div class="sk-qr">
	  <!-- 图片 -->
      <div class="sk-qr-inner">
          <img src="https://images-cdn.example.com/reward-qr.webp" />
      </div>
      <!-- 标题 -->
      <span class="sk-qr-title">微信扫一扫</span>
      <span>(｀･ω･´)ゞ敬礼っ</span>
  </div>
  <!-- 如有多个投喂方式，可设置多个`sk-qr` -->
</div>
```

上侧内容会以如下形式渲染

![1723373589793](https://static.ltgcm.top/md/20240811205134.webp)

### 预览

这是一个二次元风格的皮肤，部分页面预览如下：

- 封面

![1723366023813](https://static.ltgcm.top/md/20240811185406.webp)

- 首页

![1723366077548](https://static.ltgcm.top/md/20240811185404.webp)

- 排行榜页

![1723366125801](https://static.ltgcm.top/md/20240811205144.webp)

- 标签页

![1723365782727](https://static.ltgcm.top/md/20240811205153.webp)

- 友链

![1723366157949](https://static.ltgcm.top/md/20240811205200.webp)

- 文章详情页

![1723366228865](https://static.ltgcm.top/md/20240811205207.webp)

![1723366265695](https://static.ltgcm.top/md/20240811205214.webp)

- 相册页

![1723366633086](https://static.ltgcm.top/md/20240811205222.webp)