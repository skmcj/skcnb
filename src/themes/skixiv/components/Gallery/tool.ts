import { _dts } from '@/utils/domUtil';

export interface Gallery {
  detailUrl?: string;
  url: string;
  desc?: string;
  width?: number;
  height?: number;
}

export interface GalleryDetail {
  url: string;
  originUrl?: string;
  returnUrl?: string;
  title?: string;
  width?: number;
  height?: number;
}

/**
 * 提取图片链接
 */
const parseImg = (dom: HTMLAnchorElement) => {
  const gallery: Gallery = {
    url: ''
  };
  gallery.detailUrl = dom.getAttribute('href') || void 0;
  const img = _dts.getElByTagOne('img', dom);
  if (img) {
    const url = img.getAttribute('src');
    if (url) gallery.url = url.replace(/t_/, 'o_');
    gallery.desc = img.getAttribute('alt') || void 0;
    gallery.width = img.naturalWidth;
    gallery.height = img.naturalHeight;
  }
  return gallery.url ? gallery : void 0;
};

/** 获取相册标题 */
export const getGalleryTitle = () => {
  const dom = _dts.getElByClsOne<'h1'>('thumbTitle');
  return dom ? dom.innerText.trim() : void 0;
};

/** 获取相册描述 */
export const getGalleryDesc = () => {
  const dom = _dts.getElByClsOne<'div'>('thumbDescription');
  return dom ? dom.innerText.trim() : void 0;
};

/** 获取相册列表 */
export const getGalleryList = () => {
  const gallerys: Gallery[] = [];
  const dom = _dts.getElByClsOne<'div'>('gallery');
  if (dom) {
    const imgs = _dts.getElByCls<'a'>('ThumbNail', dom);
    for (let i = 0; i < imgs.length; i++) {
      const gallery = parseImg(imgs[i]);
      gallery && gallerys.push(gallery);
    }
  }
  return gallerys;
};

/** 获取相册详情页信息 */
export const getGalleryDt = () => {
  const detail: GalleryDetail = {
    url: ''
  };
  const dom = _dts.getElByClsOne<'div'>('gallery');
  if (dom) {
    // 获取图片链接
    let img = _dts.getElById<'img'>('ViewPicture1_GalleryImage');
    if (!img) img = _dts.getElByTagOne('img', dom);
    if (img) {
      detail.url = img.getAttribute('src') ?? '';
      detail.width = img.naturalWidth;
      detail.height = img.naturalHeight;
    }
    // 获取标题
    const title = _dts.getElByClsOne<'div'>('galleryTitle', dom);
    if (title) detail.title = title.innerText.trim();
    // 返回相册
    const rt = _dts.getElById<'a'>('ViewPicture1_ReturnUrl');
    if (rt) detail.returnUrl = rt.getAttribute('href') || void 0;
    // 原图
    const og = _dts.getElById<'a'>('ViewPicture1_OriginalImage');
    if (og) detail.originUrl = og.getAttribute('href') || void 0;
  }

  return detail;
};

/** 返回[-5, 5]范围的偏转 */
export const randomRotate = () => {
  const r = Math.round(Math.random() * 10 - 5);
  return `rotateZ(${r}deg)`;
};
