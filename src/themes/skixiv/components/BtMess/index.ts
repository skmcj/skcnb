import { _dts } from '@/utils/domUtil';
import './index.scss';
import { getBtMessData } from './tool';
import type { BtMess, BtMessItem } from './tool';

/** 创建底部消息列表 */
const createBtMessList = (data: BtMess) => {
  const list = _dts.ctBox('sk-btmess-list');
  // 标题
  const title = createTitle(data.title, data.url);
  // 内容
  const content = _dts.ctBox('sk-btmess-content');
  const bindBtMessItems = (list: BtMessItem[]) => {
    if (!list.length) return;
    const frag = _dts.ctFrag();
    for (let i = 0; i < list.length; i++) {
      const item = createItem(list[i], i + 1);
      frag.appendChild(item);
    }
    content.appendChild(frag);
  };
  if (data.asyncBind) {
    data.asyncBind(bindBtMessItems);
  } else {
    bindBtMessItems(data.list);
  }
  list.appendChild(title);
  list.appendChild(content);
  return list;
};

const createItem = (data: BtMessItem, num: number) => {
  const item = _dts.ctBox('sk-btmess-item');
  // 序号
  const no = _dts.ctBox('no');
  const noText = _dts.ctSpan(`${num}`);
  no.appendChild(noText);

  // 内容
  const content = _dts.ctBox('content');

  const contentText = _dts.ctSpan(data.text, 'text');
  if (data.url) {
    const link = createLink(data.url);
    link.appendChild(contentText);
    content.appendChild(link);
  } else {
    content.appendChild(contentText);
  }
  if (data.desc) {
    const desc = _dts.ctBox('desc');
    const descText = _dts.ctSpan(data.desc);
    descText.setAttribute('title', data.desc);
    desc.appendChild(descText);
    if (data.type === 'text') {
      const atText = _dts.ctSpan(`by ${data.at}`, 'repay');
      atText.setAttribute('title', `${data.at}`);
      desc.appendChild(atText);
    }
    content.appendChild(desc);
  }
  // more
  const more = _dts.ctBox();
  if (data.type === 'icon') {
    more.classList.add('more', 'icon');
    const icon = _dts.ctIcon('ib-last');
    more.appendChild(icon);
  }

  item.appendChild(no);
  item.appendChild(content);
  item.appendChild(more);
  return item;
};

const createTitle = (text: string, url?: string) => {
  const title = _dts.ctBox('sk-btmess-title');
  const span = _dts.ctSpan(text);
  if (url) {
    const link = createLink(url);
    link.appendChild(span);
    title.appendChild(link);
  } else {
    title.appendChild(span);
  }
  return title;
};

// 链接
const createLink = (url: string) => {
  const link = _dts.ctLink(url, 'sk-btmess-link');
  return link;
};

/**
 * 创建
 */
const createBtMess = () => {
  const btmess = _dts.ctBox('sk-btmess');
  const data = getBtMessData();
  for (const temp of data) {
    const item = createBtMessList(temp);
    btmess.appendChild(item);
  }
  return btmess;
};

export default createBtMess;
