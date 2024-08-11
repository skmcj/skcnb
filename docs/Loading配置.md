## Loading配置

从某种意义上，`Loading`效果与主题是相互独立的，也就是说，你可以按自己喜好任意地自定义`Loading`效果

一个`Loading`效果，主要由**`HTML`结构**及**`CSS`样式**组成

当然，为了使`Loading`与主题能够衔接上，需要遵循小小的规范，如下：

```html
<div id="loading" class="show">
    <!-- 内容结构随意 -->
</div>
```

- 最外层结构需有个`id`为`loading`

- 同时需定义三个关于`loading`的控制类，分别为

  - `show` — 控制`loading`的显示及显示动画

  - `before-hide` — 控制`loading`的隐藏前动画

  - `hide` — 控制`loading`的隐藏

  - ```css
    #loading.show {
        display: flex;
        // 显示时动画
        animation: loading-show .3s ease-in-out
    }
    
    #loading.before-hide {
        // 隐藏前动画
        animation: loading-hide .3s ease-in-out
    }
    
    #loading.hide {
        // 隐藏
        display: none
    }
    
    @keyframes loading-show {
        0% {
            opacity: 0
        }
    
        100% {
            opacity: 1
        }
    }
    
    @keyframes loading-hide {
        0% {
            opacity: 1
        }
    
        100% {
            opacity: 0
        }
    }
    ```

  ### 推荐做法

  - 将`Loading`的`HTML`结构放在 **页首HTML代码** 处
  - 将`Loading`的`CSS`样式放在 **页面订制CSS代码** 处

  ### 备选Loading

  项目提供了一些待选择的`Loading`效果，放在项目源码目录的`loading`目录下：`/src/loading`

  每个效果均包含详细的**说明文档**及**案例页面**

  > 如不喜欢，也可自定义
  >
  > 但建议不要设计地过于复杂，`Loading`的本质就是为了在页面加载完成前给用户提示，如果设计地过于复杂，导致渲染时长过长，占用过多性能，就有点本末倒置了