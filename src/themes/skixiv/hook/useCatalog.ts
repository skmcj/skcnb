import { _dts } from '@/utils/domUtil';
import useScroll from './useScroll';

interface CatalogItem {
  node: string;
  name: string;
  href: string;
}

const ACTIVECLASS = 'active';
const SCROLLDY = 36;

const headerTop: number[] = [];
const catalogDom = {
  target: null as HTMLElement | null,
  lastIndex: 0,
  doms: [] as HTMLLIElement[]
};

/** 获取目录 */
const getCatalogData = () => {
  const list: CatalogItem[] = [];
  headerTop.length = 0;
  $('#cnblogs_post_body :header').each((i, el) => {
    headerTop.push(el.offsetTop);
    const item: CatalogItem = {
      node: el.nodeName.toLowerCase(),
      name: el.innerText,
      href: `#${el.getAttribute('id')}`
    };
    list.push(item);
  });
  return list;
};

/** 更新offsetTop */
const refreshCataDom = () => {
  window.addEventListener('load', () => {
    headerTop.length = 0;
    $('#cnblogs_post_body :header').each((i, el) => {
      headerTop.push(el.offsetTop);
    });
    bindTarget();
  });
};

/** 创建目录项 */
const createCatalogItem = (data: CatalogItem) => {
  const catalog = _dts.ctEl('li', `sk-catalog-item ${data.node}`);
  const link = _dts.ctLink(data.href);
  link.innerText = data.name;
  catalog.appendChild(link);
  return catalog;
};

const bindTarget = () => {
  catalogDom.target = document.documentElement;
  if (!catalogDom.target) catalogDom.target = _dts.getElById('mainContent');
  if (!catalogDom.target) catalogDom.target = _dts.getElById('post_detail');
};

const initCataScroll = () => {
  catalogDom.lastIndex = 0;
  catalogDom.doms[0].classList.add(ACTIVECLASS);
};

/** 滚动到目标项 */
const scrollCata = (index: number) => {
  if (catalogDom.doms.length <= index) return;
  if (catalogDom.lastIndex == index) return;
  catalogDom.doms[catalogDom.lastIndex].classList.remove(ACTIVECLASS);
  catalogDom.doms[index].classList.add(ACTIVECLASS);
  catalogDom.lastIndex = index;
};

const bindScrollCata = () => {
  if (!catalogDom.target) return;
  if (!headerTop.length) return;
  const scrollTop = catalogDom.target.scrollTop;
  const firstTop = headerTop[0];
  if (scrollTop < firstTop) {
    scrollCata(0);
    return;
  }
  for (let i = 1; i < headerTop.length; i++) {
    if (headerTop[i] > scrollTop) {
      if (headerTop[i] - scrollTop <= SCROLLDY) {
        scrollCata(i);
      } else {
        scrollCata(i - 1);
      }
      return;
    }
  }
  scrollCata(headerTop.length - 1);
};

/** 创建目录 */
export const createCatalog = () => {
  const catalog = _dts.ctNav('sk-catalog');
  // 标题

  // 目录
  const list = _dts.ctEl('ul', 'sk-catalog-list');
  const data = getCatalogData();
  for (const dataItem of data) {
    const item = createCatalogItem(dataItem);
    list.appendChild(item);
    catalogDom.doms.push(item);
  }
  catalog.appendChild(list);
  initCataScroll();
  refreshCataDom();
  useScroll(bindScrollCata);
  return catalog;
};
