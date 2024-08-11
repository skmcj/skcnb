import { _dts } from '@/utils/domUtil';

export interface CateItem {
  name: string;
  url: string;
  count?: string;
}

/** 获取链接 */
const getHref = (text: string) => {
  // href
  const regEx = /href="(.+)"/.exec(text);
  return regEx ? regEx[1] : '';
};

const getCount = (text: string) => {
  const regEx = /\(([0-9]+)\)/.exec(text);
  return regEx ? regEx[1] : '';
};

const getName = (text: string) => {
  const regEx = /(.+)\([0-9]+\)/.exec(text);
  return regEx ? regEx[1] : text;
};

/** 获取类别标签 */
export const getCateData = () => {
  const list: CateItem[] = [];
  const dom = _dts.getElByCls<'div'>('category-link-list');
  if (dom.length > 0) {
    const main = _dts.getElByCls<'div'>('category-list-item', dom[0]);
    for (let i = 0; i < main.length; i++) {
      const item: CateItem = {
        name: getName(main[i].innerText),
        url: getHref(main[i].innerHTML),
        count: getCount(main[i].innerText)
      };
      list.push(item);
    }
  }
  return list;
};
