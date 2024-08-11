## 暗夜猫眼-Loading

- **预览**



- **HTML**

```html
<div id="loading" class="show">
    <div class="cat-eye">
        <div class="eye left"></div>
        <div class="eye right"></div>
    </div>
</div>
```

- 将上侧代码添加到**页首HTML代码**栏目下**CSS**

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
    background-color: #010b01;
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

#loading .cat-eye {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    gap: 3em;
}

#loading .eye {
    width: 10em;
    height: 5em;
    position: relative;
    overflow: hidden;
    border-radius: 0 14em 0 14em;
    border: 0.1em solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(5em, #072922 20%, #196748 100%);
    box-shadow: 
        0.8em 0.8em 1em 0 rgba(0, 0, 0, 0.3) inset,
        -0.3em -0.3em 0.8em 0 rgba(255, 255, 255, 0.6) inset;
    animation: close-eye 1s infinite alternate-reverse;
    transform-origin: 50% 80%;
}

#loading .eye.right {
    border-radius: 14em 0 14em 0;
    box-shadow: 
        -0.8em 0.8em 1em 0 rgba(0, 0, 0, 0.3) inset,
        0.3em -0.3em 0.8em 0 rgba(255, 255, 255, 0.6) inset;
}

#loading .eye::before {
    content: '';
    display: block;
    width: 1.6em;
    height: 4.8em;
    border-radius: 1em / 3em;
    filter: blur(0.12em);
    background: radial-gradient(0.4em 3.6em, #0f1922, #0e0d0d);
    animation: ceye 1s infinite alternate-reverse;
}

@keyframes close-eye {
    0% {
        transform: scaleY(100%);
    }

    100% {
        transform: scaleY(0%);
        border-radius: 1.6em / 0.8em;
        opacity: 0;
    }
}

@keyframes ceye {
    0% {
        transform: scaleY(100%);
    }

    100% {
        transform: scaleY(200%);
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