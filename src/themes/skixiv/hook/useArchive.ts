import { _dts } from '@/utils/domUtil';

interface ArchiveItem {
  url: string;
  title: string;
  count: string;
  visible?: string;
  onclick?: string;
}

/** 获取归档数据 */
const getArchiveData = () => {
  const list: ArchiveItem[] = [];
  $('#sidebar_postarchive li a').each((i, el) => {
    const exec = /(.+)\(([0-9]+)\)/.exec(el.innerText);
    const item: ArchiveItem = {
      url: el.getAttribute('href') || '#',
      title: exec ? exec[1] : '****年**月',
      count: exec ? exec[2] : '未知'
    };
    const ocl = el.getAttribute('onclick');
    if (ocl) {
      item.onclick = ocl;
      item.title = '更多';
      item.count = '';
    }
    const parent = el.parentElement;
    if (parent) {
      const attr = parent.getAttribute('data-category-list-item-visible');
      item.visible = attr !== null ? attr : void 0;
    }
    list.push(item);
  });

  return list;
};

/**
 * 创建归档项
 * @param data
 * @returns
 */
const createArchiveItem = (data: ArchiveItem) => {
  const item = _dts.ctEl('li', 'sk-archive-item');
  const link = _dts.ctLink(data.url);
  link.innerText = data.title;
  if (data.onclick) {
    link.setAttribute('onclick', 'sideColumnManager.loadMore(this)');
  }
  if (data.visible) {
    item.setAttribute('data-category-list-item-visible', data.visible);
    item.style.display = data.visible === 'true' ? 'block' : 'none';
  }

  item.setAttribute('title', data.count);
  item.appendChild(link);
  return item;
};

/**
 * 创建归档列表
 */
export const createArchive = () => {
  const archives = _dts.ctBox('sk-archives');
  const list = _dts.ctEl('ul', 'sk-archive-list');
  const data = getArchiveData();
  for (let i = 0; i < data.length; i++) {
    const item = createArchiveItem(data[i]);
    list.appendChild(item);
  }
  archives.appendChild(list);
  return archives;
};
