/**
 * 提取标签的 href 属性
 * @param {string} a 需要提取 href 的 dom 字符串
 */
export const execHref = (a: string) => {
  const exec = /href="(.+)"/.exec(a);
  return exec ? exec[1] : '';
};

/**
 * 提取标签的 src 属性
 * @param {string} a 需要提取 Src 的 dom 字符串
 */
export const execSrc = (a: string) => {
  const exec = /src="(.+?)"/.exec(a);
  return exec ? exec[1] : '';
};

/**
 * 提取标签的 postid 属性
 * @param {string} a 含有 postid={content} 的字符串
 */
export const execPostId = (a: string) => {
  const exec = /postid="(.+)"/.exec(a);
  return exec ? parseInt(exec[1]) : void 0;
};

type HLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface ElAttr {
  [key: string]: string;
}

/** 重新封装的DOM操作工具 */
class DOMUtil {
  constructor() {
    if (!document) {
      throw new Error('当前环境不支持DOM操作');
    }
  }

  getElById(id: string): HTMLElement | null;
  getElById<T extends keyof HTMLElementTagNameMap>(id: string): HTMLElementTagNameMap[T] | null;

  /**
   * 根据ID获取元素
   * @param id ID
   * @returns 返回具有ID属性指定值的第一个对象的引用
   */
  getElById(id: string) {
    return document.getElementById(id);
  }

  getElByCls(cls: string, dom?: HTMLElement): HTMLCollectionOf<Element>;
  getElByCls<T extends keyof HTMLElementTagNameMap>(
    cls: string,
    dom?: HTMLElement
  ): HTMLCollectionOf<HTMLElementTagNameMap[T]>;

  /**
   * 根据类名获取元素集合
   * @param cls 类名(多个类名可用空格分隔)
   * @param dom 父元素
   * @returns 返回具有指定所有类名的元素集合
   */
  getElByCls(cls: string, dom?: HTMLElement) {
    if (dom) return dom.getElementsByClassName(cls);
    else return document.getElementsByClassName(cls);
  }

  getElByClsOne(cls: string, dom?: HTMLElement): Element | null;
  getElByClsOne<T extends keyof HTMLElementTagNameMap>(cls: string, dom?: HTMLElement): HTMLElementTagNameMap[T] | null;

  /**
   * 根据类名获取单个元素
   * @param cls 类名(多个类名可用空格分隔)
   * @param dom 父元素
   * @returns 返回具有指定类名的首个元素
   */
  getElByClsOne(cls: string, dom?: HTMLElement) {
    let res;
    if (dom) res = dom.getElementsByClassName(cls);
    else res = document.getElementsByClassName(cls);
    return res.length > 0 ? res[0] : null;
  }

  /**
   * 根据标签名获取元素集合
   * @param tn 标签名
   * @param dom 父元素
   * @returns 返回具有指定标签名的元素集合
   */
  getElByTag<K extends keyof HTMLElementTagNameMap>(tn: K, dom?: HTMLElement) {
    if (dom) return dom.getElementsByTagName(tn);
    else return document.getElementsByTagName(tn);
  }

  /**
   * 根据标签名获取单个元素
   * @param tn 标签名
   * @param dom 父元素
   * @returns 返回具有指定标签名的首个元素
   */
  getElByTagOne<K extends keyof HTMLElementTagNameMap>(tn: K, dom?: HTMLElement) {
    let res;
    if (dom) res = dom.getElementsByTagName(tn);
    else res = document.getElementsByTagName(tn);
    return res.length > 0 ? res[0] : null;
  }

  /**
   * 根据name属性值获取节点集合
   * @param name name属性值
   * @returns 返回拥有对应name属性值的对象集合
   */
  getElByName(name: string) {
    return document.getElementsByName(name);
  }

  /**
   * 根据命名空间和标签名获取节点列表
   * @param nsp 命名空间
   * @param name 标签名
   * @param dom 父元素
   * @returns 返回具有属于给定命名空间的标签名的节点列表
   */
  getElByTNNs(nsp: string, name: string, dom?: HTMLElement) {
    if (dom) return dom.getElementsByTagNameNS(nsp, name);
    else return document.getElementsByTagNameNS(nsp, name);
  }

  getEl<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  getEl<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  getEl<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
  getEl<E extends Element = Element>(selectors: string): E | null;

  /**
   * 根据选择器获取元素
   * @param selectors 选择器
   * @param dom 父元素
   * @returns 返回具有指定选择器的第一个元素对象
   */
  getEl(selectors: string, dom?: HTMLElement) {
    if (dom) return dom.querySelector(selectors);
    else return document.querySelector(selectors);
  }

  getElAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  getElAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  getElAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  getElAll<E extends Element = Element>(selectors: string): NodeListOf<E>;

  /**
   * 根据选择器获取元素集合
   * @param selectors 选择器
   * @param dom 父元素
   * @returns 获取具有指定选择器的所有元素集合
   */
  getElAll(selectors: string, dom?: HTMLElement) {
    if (dom) return dom.querySelectorAll(selectors);
    else return document.querySelectorAll(selectors);
  }

  private bindElAttr(el: HTMLElement, attrs?: ElAttr) {
    if (attrs) {
      for (const key in attrs) {
        switch (key) {
          case 'text':
            el.innerText = attrs[key];
            break;
          case 'html':
            el.innerHTML = attrs[key];
            break;
          case 'content':
            el.textContent = attrs[key];
            break;
          default:
            el.setAttribute(key, attrs[key]);
        }
      }
    }
  }

  /**
   * 创建片段Fragment
   * @returns
   */
  ctFrag() {
    const frag = document.createDocumentFragment();
    return frag;
  }

  /**
   * 创建Svg元素
   * @param name 标签名
   * @param namespaceURI 命名空间
   * @returns 返回指定的新创元素
   */
  ctElNs<K extends keyof SVGElementTagNameMap>(name: K, namespaceURI: string = 'http://www.w3.org/2000/svg') {
    const el = document.createElementNS(namespaceURI, name) as SVGElementTagNameMap[K];
    return el;
  }

  /**
   * 创建SVG元素
   * @param viewBox
   * @param id
   * @returns
   */
  ctSVGSvg(viewBox?: string, cls?: string, id?: string) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    viewBox && el.setAttribute('viewBox', viewBox);
    id && el.setAttribute('id', id);
    cls && el.setAttribute('class', cls);
    return el;
  }

  /**
   * 创建Path元素
   * @param d
   * @param id
   * @returns
   */
  ctSVGPath(d?: string, cls?: string, id?: string) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    d && el.setAttribute('d', d);
    id && el.setAttribute('id', id);
    cls && el.setAttribute('class', cls);
    return el;
  }

  /**
   * 创建Circle元素
   * @param d
   * @param id
   * @returns
   */
  ctSVGCircle(cx: string, cy: string, r: string, cls?: string, id?: string) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cx && el.setAttribute('cx', cx);
    cy && el.setAttribute('cy', cy);
    r && el.setAttribute('r', r);
    id && el.setAttribute('id', id);
    cls && el.setAttribute('class', cls);
    return el;
  }

  /**
   * 创建元素
   * @param name 标签名
   * @param cls 类名(多个用空格隔开)
   * @param id id
   * @returns 返回指定的新创元素
   */
  ctEl<K extends keyof HTMLElementTagNameMap>(name: K, cls?: string, id?: string) {
    const el = document.createElement(name);
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建文本节点
   * @returns 返回文本节点
   */
  ctText(text: string) {
    const el = document.createTextNode(text);
    return el;
  }

  /**
   * 创建元素
   * @param name 元素名
   * @param attrs 属性配置
   * @returns
   */
  ctElPlus<K extends keyof HTMLElementTagNameMap>(name: K, attrs?: ElAttr) {
    const el = document.createElement(name);
    this.bindElAttr(el, attrs);
    return el;
  }

  /**
   * 创建DIV元素
   * @param cls 类名
   * @param id ID
   * @returns 返回DIV元素
   */
  ctBox(cls?: string, id?: string) {
    const el = document.createElement('div');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建标题H元素
   * @param text
   * @param cls
   * @param id
   * @param level
   * @returns
   */
  ctTitle(text?: string, level?: HLevel, cls?: string, id?: string) {
    const el = document.createElement(`h${level}`) as HTMLHeadingElement;
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    text && (el.innerText = text);
    return el;
  }

  /**
   * 创建SPAN元素
   * @param text
   * @param cls
   * @param id
   */
  ctSpan(text?: string, cls?: string, id?: string) {
    const el = document.createElement('span');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    text && (el.innerText = text);
    return el;
  }

  /**
   * 创建I元素
   * @param cls
   * @param id
   * @returns
   */
  ctIcon(cls?: string, id?: string) {
    const el = document.createElement('i');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建图片元素
   * @param src
   * @param cls
   * @param id
   * @returns
   */
  ctImg(src?: string, cls?: string, id?: string) {
    const el = document.createElement('img');
    src && el.setAttribute('src', src);
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建超链接元素
   * @param href
   * @param cls
   * @param id
   * @returns
   */
  ctLink(href?: string, cls?: string, id?: string) {
    const el = document.createElement('a');
    href && el.setAttribute('href', href);
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建P元素
   * @param text
   * @param cls
   * @param id
   */
  ctP(text?: string, cls?: string, id?: string) {
    const el = document.createElement('p');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    text && (el.innerText = text);
    return el;
  }

  /**
   * 创建HEADER元素
   * @param cls
   * @param id
   */
  ctHeader(cls?: string, id?: string) {
    const el = document.createElement('header');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建NAV元素
   * @param cls
   * @param id
   */
  ctNav(cls?: string, id?: string) {
    const el = document.createElement('nav');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }

  /**
   * 创建MAIN元素
   * @param cls
   * @param id
   */
  ctMain(cls?: string, id?: string) {
    const el = document.createElement('main');
    cls && el.setAttribute('class', cls);
    id && el.setAttribute('id', id);
    return el;
  }
}

/** 自定义DOM操作工具 */
export const _dts = new DOMUtil();
