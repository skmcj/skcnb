import { _dts } from '@/utils/domUtil';
import { ImageViewer } from '@/utils/ImageViewer';
import { setBrand, setCover } from '../../hook/useBrand';
import './index.scss';
import { getGalleryTitle, getGalleryDesc, getGalleryList, getGalleryDt, randomRotate, type Gallery } from './tool';

const calcWHC = (w?: number, h?: number) => {
  if (!w || !h) return 'hs';
  return w > h ? 'hs' : 'vs';
};

// 创建钉子图标
const createPinIcon = () => {
  const svg = _dts.ctSVGSvg('0 0 175.76 175.76', 'i-pin');
  const circle = _dts.ctSVGCircle('87.88', '87.88', '87.88', 'mn');
  const bd = _dts.ctSVGPath(
    'M87.88,0C39.34,0,0,39.34,0,87.88s39.34,87.88,87.88,87.88,87.88-39.34,87.88-87.88S136.41,0,87.88,0Zm1.95,169.73c-46.29,0-83.81-37.52-83.81-83.81S43.54,2.12,89.83,2.12s83.81,37.52,83.81,83.81-37.52,83.81-83.81,83.81Z',
    'bd'
  );
  const hh = _dts.ctSVGPath(
    'M125.05,33.85c-.03-.81,.2-1.66,.75-2.35,1.22-1.61,3.51-1.92,5.12-.7,12.28,9.31,18.65,20.59,18.91,21.05,.98,1.77,.35,4-1.42,4.98-1.75,.98-4,.35-4.98-1.4-.06-.1-5.95-10.46-16.95-18.8-.88-.7-1.39-1.72-1.43-2.78Zm-12.26-7.74c-.02-.65,.13-1.33,.48-1.93,.99-1.77,3.23-2.38,5-1.39l2,1.13c1.77,.99,2.38,3.23,1.39,5s-3.23,2.38-5,1.39l-2-1.13c-1.14-.65-1.82-1.84-1.87-3.06Z',
    'hh'
  );
  svg.appendChild(circle);
  svg.appendChild(bd);
  svg.appendChild(hh);
  return svg;
};

const createGalleryItem = (data: Gallery, cb?: Function) => {
  const item = _dts.ctBox('sk-gallery-item');
  item.style.transform = randomRotate();
  const whc = calcWHC(data.width, data.height);
  // console.log(data, whc);
  whc && item.classList.add(whc);
  // icon
  const icon = _dts.ctBox('sk-gallery-pin');
  const svg = createPinIcon();
  if (data.detailUrl) {
    const link = _dts.ctLink(data.detailUrl);
    link.appendChild(svg);
    icon.appendChild(link);
  } else {
    icon.appendChild(svg);
  }
  const cover = _dts.ctBox('sk-gallery-img');
  cover.addEventListener('click', () => {
    cb && cb(data.url);
  });
  const img = _dts.ctImg(data.url);
  img.setAttribute('loading', 'lazy');
  data.desc && img.setAttribute('alt', data.desc);
  cover.appendChild(img);
  data.desc && cover.setAttribute('title', data.desc);
  item.appendChild(icon);
  item.appendChild(cover);
  return item;
};

/**
 * 创建相册
 */
export const createGallery = () => {
  const gallery = _dts.ctBox('sk-gallery');
  const list = getGalleryList();
  const title = getGalleryTitle();
  const desc = getGalleryDesc();
  title &&
    setBrand({
      title: title,
      desc: desc
    });
  !!list.length && setCover(list[0].url);
  const viewer = new ImageViewer();

  function preview(index: string | number) {
    viewer.preview.call(viewer, index);
  }

  const frag = _dts.ctFrag();
  const urls: string[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = createGalleryItem(list[i], preview);
    urls.push(list[i].url);
    frag.appendChild(item);
  }
  gallery.appendChild(frag);
  viewer.setImgs(urls);

  return gallery;
};

const createLinkBtn = (url: string, text: string, cls?: string, target?: string) => {
  const btn = _dts.ctBox('gallery-btn');
  cls && btn.classList.add(cls);
  const link = _dts.ctLink(url);
  target && link.setAttribute('target', target);
  const span = _dts.ctSpan(text);
  link.appendChild(span);
  btn.appendChild(link);
  return btn;
};

/**
 * 创建相册详情页
 */
export const createGalleryDetail = () => {
  const detail = _dts.ctBox('sk-gallery-detail');
  const data = getGalleryDt();
  const title = _dts.ctBox('title');
  if (data.title) {
    title.innerText = data.title;
    setBrand({
      title: data.title
    });
  }
  const viewer = new ImageViewer();

  function preview(index: string | number) {
    viewer.preview.call(viewer, index);
  }

  const cover = _dts.ctBox('cover');
  if (data.url) {
    const img = _dts.ctImg(data.url);
    img.setAttribute('alt', data.title ?? '');
    cover.appendChild(img);
    setCover(data.url);
    viewer.setImgs([data.url]);
    cover.addEventListener('click', () => {
      preview(data.url);
    });
  }
  detail.appendChild(title);
  detail.appendChild(cover);

  if (data.returnUrl) {
    const rtLink = createLinkBtn(data.returnUrl, '返回相册', 'left');
    detail.appendChild(rtLink);
  }
  if (data.originUrl) {
    const ogLink = createLinkBtn(data.originUrl, '查看原图', 'right', '_New');
    detail.appendChild(ogLink);
  }

  return detail;
};
