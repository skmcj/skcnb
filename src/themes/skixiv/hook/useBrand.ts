import { randomCover, randomSign } from '@/utils/dataUtil';
import { _dts } from '@/utils/domUtil';

interface BrandInfoItem {
  icon?: string;
  text: string;
  cls?: string;
}

interface BrandOptions {
  title?: string;
  info?: BrandInfoItem[];
  desc?: string;
}

const dom: {
  cover?: HTMLImageElement;
  brand?: HTMLDivElement;
} = {};

const content: {
  cover?: string;
  brand?: BrandOptions;
} = {};

const flag = {
  cover: false,
  brand: false
};

const createBrand = (parent: HTMLDivElement, options: BrandOptions) => {
  // 清空子元素
  $(parent).children().remove();
  if (options.title) {
    const title = _dts.ctSpan(options.title, 'title');
    parent.appendChild(title);
  }
  if (options.desc) {
    const desc = _dts.ctSpan(options.desc, 'desc');
    parent.appendChild(desc);
  }
  if (options.info) {
    const info = _dts.ctBox('info');
    for (const item of options.info) {
      const infoItem = _dts.ctSpan('', 'item');
      if (item.icon) {
        const i = _dts.ctIcon(item.icon);
        infoItem.appendChild(i);
      }
      infoItem.appendChild(_dts.ctSpan(item.text, item.cls));
      info.appendChild(infoItem);
    }

    parent.appendChild(info);
  }
};

/** 绑定牌头 */
export const bindBrand = (el: HTMLDivElement) => {
  dom.brand = el;
  if (content.brand) {
    createBrand(el, content.brand);
    content.brand = void 0;
  }
};

/** 绑定封面 */
export const bindCover = (el: HTMLImageElement) => {
  dom.cover = el;
  if (content.cover) {
    el.setAttribute('src', content.cover);
    content.cover = void 0;
  }
};

const setCoverG = (url: string) => {
  if (dom.cover) {
    dom.cover.setAttribute('src', url);
  } else {
    content.cover = url;
  }
  flag.cover = true;
};

/** 设置封面 */
export const setCover = (url?: string) => {
  if (url) {
    setCoverG(url);
  } else {
    randomCover('daily').then(src => {
      setCoverG(src);
    });
  }
};

const setBrandG = (options: BrandOptions) => {
  if (dom.brand) {
    createBrand(dom.brand, options);
  } else {
    content.brand = options;
  }
  flag.brand = true;
};

/** 设置牌头 */
export const setBrand = (options?: BrandOptions) => {
  if (options) {
    setBrandG(options);
  } else {
    randomSign('random').then(sign => {
      setBrandG({ title: sign });
    });
  }
};

/** 是否已设置封面 */
export const coverFlag = () => flag.cover;

/** 是否已设置牌头 */
export const brandFlag = () => flag.brand;
