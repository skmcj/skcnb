import './index.scss';
import { createIcon } from './icon';
import { throttle } from '@/utils/commonUtil';
import { _dts } from '../domUtil';

interface ViewerTransform {
  deg: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * 图片预览器
 *  - 利用纯原生 JS 造的一个图片预览器
 *  - 支持图片预览、放缩、移动、旋转、切换
 */
export class ImageViewer {
  // 本体
  private dom: HTMLDivElement;
  // 图片列表本体
  private inner: HTMLDivElement;
  // 动画时长|与CSS保持一致
  private DUR: number = 300;
  // 放缩倍数
  private ZOOMRATE: number = 1.2;
  // 图片DOM列表
  private imgs: HTMLImageElement[] = [];
  // 图片URL列表
  private urls: string[] = [];
  // 图片数量
  private len: number = 0;
  // 当前索引
  private currentIndex: number = 0;
  // 是否可见
  private visible: boolean = false;
  // 当前图片变换数据
  private currentTransform: ViewerTransform;
  // 上下切换按钮
  private pnBtns: HTMLElement[] = [];

  constructor() {
    this.dom = this.initDOM();
    this.inner = _dts.ctBox('sk-viewer-inner');
    this.dom.appendChild(this.inner);
    this.currentTransform = this.initTransform();
    document.body.appendChild(this.dom);
  }
  /** 显示 */
  public show() {
    this.dom.classList.add('before-show', 'show');
    document.body.classList.add('viewer-scroll-lock');
    setTimeout(() => {
      this.dom.classList.remove('before-show');
      this.visible = true;
    }, this.DUR);
    this.addListener();
  }
  /** 隐藏 */
  public hide() {
    this.dom.classList.add('before-hide');
    document.body.classList.remove('viewer-scroll-lock');
    setTimeout(() => {
      this.dom.classList.remove('before-hide', 'show');
      this.visible = false;
    }, this.DUR);
  }
  /** 设置图片 */
  public setImgs(urls: string[]) {
    this.imgs.length = 0;
    this.urls.length = 0;
    const frag = _dts.ctFrag();
    for (let i = 0; i < urls.length; i++) {
      const img = _dts.ctImg(urls[i], 'sk-viewer-image');
      img.style.display = 'none';
      this.imgs.push(img);
      this.urls.push(urls[i]);
      img.addEventListener('mousedown', e => this.mouseDownHandler.call(this, e));
      frag.appendChild(img);
    }
    this.len = this.imgs.length;
    this.inner.appendChild(frag);
    if (this.len === 1) this.hidePrevAndNextBtn();
    else this.showPrevAndNextBtn();
  }
  /** 添加图片 */
  public addImg(url: string) {
    const img = _dts.ctImg(url, 'sk-viewer-image');
    img.style.display = 'none';
    this.imgs.push(img);
    this.urls.push(url);
    img.addEventListener('mousedown', e => this.mouseDownHandler.call(this, e));
    this.inner.appendChild(img);
    this.len = this.imgs.length;
    if (this.len === 1) this.hidePrevAndNextBtn();
    else this.showPrevAndNextBtn();
  }
  /**
   * 预览指定图片
   * @param {string|number}
   *  - string => 图片URL
   *  - number => 图片索引
   */
  public preview(index: string | number) {
    // console.log(this);
    if (this.len <= 0) {
      console.error('PreviewError: nothing to preview');
      return;
    }
    if (typeof index === 'string') {
      index = this.findCurrentIndex(index);
    }
    if (index < 0) {
      console.error('IndexError: index is illegal');
      return;
    }
    if (index >= this.len) {
      console.error('IndexError: index out of range');
      return;
    }
    this.cleanPreview();
    if (!this.visible) this.show();
    this.showIndex(index);
  }
  /** 显示指定索引的图片 */
  private showIndex(index: number) {
    this.imgs[index].setAttribute('style', 'transform: scale(1) rotate(0deg);');
    this.currentTransform = this.initTransform();
    this.currentIndex = index;
  }
  /** 清楚预览 */
  private cleanPreview() {
    for (let i = 0; i < this.imgs.length; i++) {
      if (this.imgs[i].style.display !== 'none') {
        this.imgs[i].style.display = 'none';
        break;
      }
    }
  }
  /** 滚轮事件 */
  private mousewheelHandler = throttle(200, (e: WheelEvent) => {
    const delta = e.deltaY || e.deltaX;
    delta < 0 ? this.zoomIn.call(this) : this.zoomOut.call(this);
  });
  /** 鼠标按键处理 */
  private mouseDownHandler(e: MouseEvent) {
    if (e.button !== 0) return;

    const { offsetX, offsetY } = this.currentTransform;
    const startX = e.pageX;
    const startY = e.pageY;

    const dragHandler = throttle(200, (ev: MouseEvent) => {
      this.currentTransform.offsetX = offsetX + ev.pageX - startX;
      this.currentTransform.offsetY = offsetY + ev.pageY - startY;
      this.refreshTransform();
    });
    document.addEventListener('mousemove', dragHandler);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', dragHandler);
    });

    e.preventDefault();
  }
  // 添加监听
  private addListener() {
    document.addEventListener('wheel', this.mousewheelHandler);
  }
  // 移除监听
  private removeListener() {
    document.removeEventListener('wheel', this.mousewheelHandler);
  }
  // 关闭
  private close() {
    this.hide();
    this.removeListener();
  }
  // 上一张
  private prev() {
    this.preview((this.currentIndex - 1 + this.len) % this.len);
  }
  // 下一张
  private next() {
    this.preview((this.currentIndex + 1 + this.len) % this.len);
  }
  // 放大
  private zoomIn(flag?: boolean) {
    if (this.currentTransform.scale < 7) {
      this.currentTransform.scale = Number.parseFloat((this.currentTransform.scale * this.ZOOMRATE).toFixed(3));
      this.refreshTransform(flag);
    }
  }
  // 缩小
  private zoomOut(flag?: boolean) {
    if (this.currentTransform.scale > 0.2) {
      this.currentTransform.scale = Number.parseFloat((this.currentTransform.scale / this.ZOOMRATE).toFixed(3));
      this.refreshTransform(flag);
    }
  }
  // 还原
  private fullScreen() {
    this.resetTransform();
  }
  // 左转
  private turnLeft() {
    // -90
    this.currentTransform.deg -= 90;
    this.refreshTransform();
  }
  // 右转
  private turnRight() {
    // 90
    this.currentTransform.deg += 90;
    this.refreshTransform();
  }
  // 根据图片URL找索引
  private findCurrentIndex(url: string) {
    return this.urls.indexOf(url);
  }
  // 初始化变换数据
  private initTransform(): ViewerTransform {
    return {
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0
    };
  }
  // 重置变换数据
  private resetTransform() {
    this.currentTransform.scale = 1;
    this.currentTransform.deg = 0;
    this.currentTransform.offsetX = 0;
    this.currentTransform.offsetY = 0;
    this.refreshTransform();
  }
  // 刷新变换
  private refreshTransform(flag?: boolean) {
    const { scale, deg, offsetX, offsetY } = this.currentTransform;
    let translateX = offsetX / scale;
    let translateY = offsetY / scale;

    switch (deg % 360) {
      case 90:
      case -270:
        [translateX, translateY] = [translateY, -translateX];
        break;
      case 180:
      case -180:
        [translateX, translateY] = [-translateX, -translateY];
        break;
      case 270:
      case -90:
        [translateX, translateY] = [-translateY, translateX];
        break;
    }
    this.imgs[
      this.currentIndex
    ].style.transform = `scale(${scale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`;
    this.imgs[this.currentIndex].style.transition = !flag ? 'transform .3s' : '';
  }
  // 初始化DOM
  private initDOM() {
    const viewer = _dts.ctBox('sk-viewer');
    const mask = _dts.ctBox('sk-viewer-mask');

    // 关闭按钮
    const closeBtn = this.createBtn('close', 'sk-viewer_close');
    closeBtn.addEventListener('click', () => this.close.call(this));
    // 前一页按钮
    const prevBtn = this.createBtn('prev', 'sk-viewer_prev');
    prevBtn.addEventListener('click', () => this.prev.call(this));
    // 后一页按钮
    const nextBtn = this.createBtn('next', 'sk-viewer_next');
    nextBtn.addEventListener('click', () => this.next.call(this));

    this.pnBtns.push(prevBtn);
    this.pnBtns.push(nextBtn);
    // 底部工具组
    const tools = this.createTools();

    viewer.appendChild(mask);
    viewer.appendChild(closeBtn);
    viewer.appendChild(prevBtn);
    viewer.appendChild(nextBtn);
    viewer.appendChild(tools);
    return viewer;
  }
  // 隐藏切换按钮
  private hidePrevAndNextBtn() {
    for (let i = 0; i < this.pnBtns.length; i++) {
      this.pnBtns[i].setAttribute('style', 'display: none;');
    }
  }
  // 显示切换按钮
  private showPrevAndNextBtn() {
    for (let i = 0; i < this.pnBtns.length; i++) {
      this.pnBtns[i].setAttribute('style', '');
    }
  }
  // 创建工具组
  private createTools() {
    const tools = _dts.ctBox('sk-viewer-tools');
    // 缩小
    const zoomOut = this.createIcon('zoom-out');
    zoomOut.addEventListener('click', () => this.zoomOut.call(this));
    tools.appendChild(zoomOut);
    // 放大
    const zoomIn = this.createIcon('zoom-in');
    zoomIn.addEventListener('click', () => this.zoomIn.call(this));
    tools.appendChild(zoomIn);
    tools.appendChild(_dts.ctSpan());
    // 还原
    const fscreen = this.createIcon('full-screen');
    fscreen.addEventListener('click', () => this.fullScreen.call(this));
    tools.appendChild(fscreen);
    tools.appendChild(_dts.ctSpan());
    // 左转
    const turnLeft = this.createIcon('turn-left');
    turnLeft.addEventListener('click', () => this.turnLeft.call(this));
    tools.appendChild(turnLeft);
    // 右转
    const turnRight = this.createIcon('turn-right');
    turnRight.addEventListener('click', () => this.turnRight.call(this));
    tools.appendChild(turnRight);
    return tools;
  }
  // 创建按钮
  private createBtn(name: string, cls?: string) {
    const className = cls ? `sk-viewer-btn ${cls}` : 'sk-viewer-btn';
    const btn = _dts.ctSpan('', className);
    btn.appendChild(this.createIcon(name));
    return btn;
  }
  // 创建图标
  private createIcon(name: string) {
    const icon = _dts.ctIcon('sk-viewer-icon');
    icon.appendChild(createIcon(name));
    return icon;
  }
}
