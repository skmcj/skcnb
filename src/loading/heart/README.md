## 像素心跳-Loading

- **预览**

![像素心跳](https://static.ltgcm.top/md/20240727161839.gif)

- **HTML**

```html
<div id="loading" class="show">
    <div class="heart"></div>
</div>
```

将上侧代码添加到**页首HTML代码**栏目下

- **CSS**

```css
#loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #160c23, #7b6762)
}

#loading.show {
  display: flex;
  animation: loading-show .3s ease-in-out
}

#loading.before-hide {
  animation: loading-hide .3s ease-in-out
}

#loading.hide {
  display: none
}

#loading .heart {
  font-size: 1em;
  width: 7em;
  height: 7em;
  animation: hue 21.6s steps(18) infinite
}

#loading .heart::before {
  content: "";
  display: block;
  transition: all .4s;
  animation: pulse 1.2s steps(1) infinite;
  width: 1em;
  height: 1em;
  margin: -1em 0 0 -1em;
  box-shadow: 2em 1em #8e1a19, 3em 1em #ac0500, 5em 1em #f73f0c, 6em 1em #fa5f27, 1em 2em #740100, 2em 2em #8e0500, 3em 2em #8e1918, 4em 2em #ca1300, 5em 2em #f34f2b, 6em 2em #df351f, 7em 2em #f77c2a, 1em 3em #4b0000, 2em 3em #690100, 3em 3em #8e0f0b, 4em 3em #bf1000, 5em 3em #f84010, 6em 3em #f04222, 7em 3em #fa5724, 1em 4em #451312, 2em 4em #5a0100, 3em 4em #840e0c, 4em 4em #a51d1a, 5em 4em #ed2805, 6em 4em #d9321e, 7em 4em #f44622, 2em 5em #3b0000, 3em 5em #5d1a1b, 4em 5em #8e1a19, 5em 5em #a80700, 6em 5em #b90a00, 3em 6em #3d0000, 4em 6em #551415, 5em 6em #670100, 4em 7em #340000
}

@keyframes pulse {
  50% {
    filter: blur(.1em);
    transform: translate(-.13em, .13em)
  }
}

@keyframes hue {
  0% {
    filter: hue-rotate(0)
  }

  100% {
    filter: hue-rotate(360deg)
  }
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

将上侧代码添加到**页面订制CSS代码**栏目下

