import './index.scss';
import { getArchiveTitleData, getArticlesData, getEntryTitleData, type ArticleData, type EntryTitleData } from './tool';
import { randomCover } from '@/utils/dataUtil';
import {
  isHomePage,
  isCateDetailPage,
  isArchivePage,
  isOwner,
  isCollectionsPage,
  isPostDayPage,
  isEntryPage,
  isArchiveDayPage
} from '@/utils/cnblogUtil';
import { setBrand } from '../../hook/useBrand';
import { _dts } from '@/utils/domUtil';

// TODO
/** 绑定类别弹框 */
function bindCatePopup(selectors: string) {
  const keys = window.categoryEntry ? [window.categoryEntry.categoryId] : [];
  const type = window.categoryEntry ? window.categoryEntry.categoryType : 1;
  new TreeCategoryPopup({
    trigger: {
      element: document.querySelector(selectors),
      eventName: 'mouseenter focus'
    },
    defaultExpandKeys: keys,
    categoryType: type
  });
}

// 置顶标签
const createPinnedLabel = (text: string) => {
  const label = _dts.ctBox('sk-card-tlabel');
  const span = _dts.ctSpan(text);
  const after = _dts.ctBox('after');
  const icon = _dts.ctSVGSvg('0 0 100 100');
  const path = _dts.ctSVGPath('M 0 100 A 100 100 0 0 1 100 0 L 100 100 Z');
  icon.appendChild(path);
  after.appendChild(icon);
  label.appendChild(span);
  label.appendChild(after);
  return label;
};

// 链接
const createLink = (url: string) => {
  const link = _dts.ctLink(url, 'sk-card-link');
  return link;
};

// 标题
const createTitle = (text: string, url: string = '') => {
  const title = _dts.ctSpan(text, 'title');
  if (url) {
    const titleLink = createLink(url);
    titleLink.appendChild(title);
    return titleLink;
  } else {
    return title;
  }
};

// 详情
const createDesc = (text: string) => {
  const desc = _dts.ctBox('content');
  const label = _dts.ctSpan('摘要：', 'lb');
  const span = _dts.ctSpan(text, 'text');
  desc.appendChild(label);
  desc.appendChild(span);
  return desc;
};

// 图标表
const icons = {
  view: 'ib-view',
  comment: 'ib-comment',
  digg: 'ib-digg',
  edit: 'ib-edit-2',
  read: 'ib-switch',
  date: 'ib-date'
};

// 工具
const createTool = (count: string, type: 'view' | 'comment' | 'digg' | 'date' = 'view', url: string = '') => {
  const tool = _dts.ctBox('sk-card-tool');
  const icon = _dts.ctIcon(icons[type]);
  const text = _dts.ctSpan(count);
  if (url) {
    const link = createLink(url);
    link.appendChild(icon);
    tool.appendChild(link);
  } else {
    tool.appendChild(icon);
  }
  tool.appendChild(text);
  return tool;
};

// 更多按钮
const createMoreBtn = (type: 'icon' | 'text', text: 'read' | 'edit', url: string = '') => {
  const btn = _dts.ctBox('sk-card-btn');
  const tc = text === 'edit' ? '编辑' : '阅读全文';
  if (type === 'icon') {
    const icon = _dts.ctIcon(icons[text]);
    btn.appendChild(icon);
    btn.setAttribute('title', tc);
  } else {
    const span = _dts.ctSpan(tc);
    btn.appendChild(span);
  }
  if (text === 'edit') {
    btn.classList.add('edit');
  }
  if (url) {
    const link = createLink(url);
    link.appendChild(btn);
    return link;
  } else {
    return btn;
  }
};

// cover
const createCover = (coverUrl: string | undefined, url: string) => {
  const cover = _dts.ctBox('sk-card-cover');
  const img = _dts.ctImg('img');
  img.setAttribute('alt', 'cover');
  if (coverUrl) {
    img.setAttribute('src', coverUrl);
  } else {
    randomCover('random').then(imgUrl => {
      img.setAttribute('src', imgUrl);
    });
  }
  const coverLink = createLink(url);
  coverLink.appendChild(img);
  cover.appendChild(coverLink);
  return cover;
};

// 耳朵
const createAnt = (pos: 'left' | 'right') => {
  const ant = _dts.ctBox(`sk-card-ant ${pos}`);
  return ant;
};

/** 创建分类标题 */
const createCateTitle = (title: string, desc?: string, url?: string) => {
  const entry = _dts.ctSpan(title, 'sk-entry');
  if (desc) {
    entry.setAttribute('title', desc);
  }
  if (url) {
    const link = _dts.ctLink(url, 'sk-card-link');
    link.appendChild(entry);
    return link;
  } else {
    return entry;
  }
};

const createCates = (list: EntryTitleData[]) => {
  const entrys = _dts.ctBox('content');
  for (let i = 0; i < list.length; i++) {
    const entryItem = createCateTitle(list[i].title, list[i].desc, list[i].url);
    if (i !== 0) {
      entryItem.classList.add('sk-entry-bf');
    }
    entrys.appendChild(entryItem);
  }
  return entrys;
};

/** 创建置顶卡片 */
const createTopCard = (data: ArticleData) => {
  const card = _dts.ctBox('sk-card sk-pinned-card');
  // 置顶标签
  const pinnedLabel = createPinnedLabel('置顶文章');
  // 封面
  const cover = createCover(data.cover, data.url);
  // 内容
  const content = _dts.ctBox('sk-card-content');
  // 标题摘要
  const main = _dts.ctBox('sk-card-main');
  const title = createTitle(data.title, data.url);
  const desc = createDesc(data.desc);
  main.appendChild(title);
  main.appendChild(desc);
  // 底部词条
  const tools = _dts.ctBox('sk-card-tools');
  const viewCount = createTool(data.viewCount, 'view');
  const commentCount = createTool(data.commentCount, 'comment');
  const diggCount = createTool(data.diggCount, 'digg');
  const date = createTool(`${data.date} ${data.time}`, 'date', data.dayUrl);
  date.classList.add('sk-card-date');
  tools.appendChild(viewCount);
  tools.appendChild(commentCount);
  tools.appendChild(diggCount);
  tools.appendChild(date);
  content.appendChild(main);
  content.appendChild(tools);
  // 操作按钮
  const more = _dts.ctBox('sk-card-more');
  const read = createMoreBtn('text', 'read', data.url);
  more.appendChild(read);
  if (isOwner()) {
    const edit = createMoreBtn('text', 'edit', data.editUrl);
    more.appendChild(edit);
  }
  card.appendChild(pinnedLabel);
  card.appendChild(cover);
  card.appendChild(content);
  card.appendChild(more);
  return card;
};

/** 创建普通卡片 */
const createComCard = (data: ArticleData) => {
  const card = _dts.ctBox('sk-card sk-com-card');
  const inner = _dts.ctBox('sk-card-inner');
  // 封面
  const cover = createCover(data.cover, data.url);
  const main = _dts.ctBox('sk-card-main');
  const title = createTitle(data.title, data.url);
  const desc = createDesc(data.desc);
  desc.setAttribute('title', data.desc);
  main.appendChild(title);
  main.appendChild(desc);
  cover.appendChild(main);
  // count and date
  const content = _dts.ctBox('sk-card-content');
  const tools = _dts.ctBox('sk-card-tools');
  const viewCount = createTool(data.viewCount, 'view');
  const commentCount = createTool(data.commentCount, 'comment');
  const diggCount = createTool(data.diggCount, 'digg');
  const date = createTool(`${data.date} ${data.time}`, 'date', data.dayUrl);
  date.classList.add('sk-card-date');
  tools.appendChild(viewCount);
  tools.appendChild(commentCount);
  tools.appendChild(diggCount);
  tools.appendChild(date);
  content.appendChild(tools);
  // more
  const more = _dts.ctBox('sk-card-more');
  const read = createMoreBtn('icon', 'read', data.url);
  more.appendChild(read);
  if (isOwner()) {
    const edit = createMoreBtn('icon', 'edit', data.editUrl);
    more.appendChild(edit);
  }
  content.appendChild(more);
  inner.appendChild(cover);
  inner.appendChild(content);
  // 两个耳朵
  const lAnt = createAnt('left');
  const rAnt = createAnt('right');
  card.appendChild(lAnt);
  card.appendChild(rAnt);
  card.appendChild(inner);
  return card;
};

const createEntryTitle = (entryList: EntryTitleData[]) => {
  // 类别标题
  const entryTitle = _dts.ctBox('sk-entry');
  if (isCateDetailPage()) {
    window.addEventListener('load', () => {
      bindCatePopup('.sk-entry .content');
    });
  }
  // 图标
  const icon = _dts.ctIcon('icon ib-bell');
  // 类别表
  const entrysContent = _dts.ctBox('sk-entry-main');
  const entrys = createCates(entryList);
  entrysContent.appendChild(entrys);
  if (entryList.length > 0) {
    const lastCate = entryList[entryList.length - 1];
    setBrand({ title: lastCate.title, desc: lastCate.desc });
    if (lastCate.desc) {
      const lastDesc = _dts.ctSpan(lastCate.desc, 'desc');
      entrysContent.appendChild(lastDesc);
    }
  }
  entryTitle.appendChild(icon);
  entryTitle.appendChild(entrysContent);
  return entryTitle;
};

/** 绑定首页文章 */
const bindCardsOfHome = (parent: HTMLElement) => {
  const list = getArticlesData('home');

  // 标题
  if (isArchiveDayPage()) {
    const entryList = getArchiveTitleData();
    const entryTitle = createEntryTitle(entryList);
    parent.appendChild(entryTitle);
    if (entryList.length > 1) {
      setBrand({
        title: `${entryList[0].title}-${entryList[1].title}`
      });
    }
  }

  // 置顶文章
  const pinnedCards = _dts.ctBox('sk-pinned-cards');
  // 文章列表
  const cardsList = _dts.ctBox('sk-cards-list');
  for (const item of list) {
    if (item.pinned) {
      const card = createTopCard(item);
      pinnedCards.appendChild(card);
    } else {
      const card = createComCard(item);
      cardsList.appendChild(card);
    }
  }
  parent.appendChild(pinnedCards);
  parent.appendChild(cardsList);
};

/** 绑定类别页文章 */
const bindCardsOfEntry = (parent: HTMLElement) => {
  const list = getArticlesData('entry');
  const entryList = getEntryTitleData();
  const entryTitle = createEntryTitle(entryList);
  // 文章列表
  const cardsList = _dts.ctBox('sk-cards-list');
  for (const item of list) {
    const card = createComCard(item);
    cardsList.appendChild(card);
  }
  parent.appendChild(entryTitle);
  parent.appendChild(cardsList);
};

/**
 * <!-- 文章表 -->
 * <div class="sk-cards">
 *   <!-- 置顶文章 -->
 *   <div class="sk-pinned-cards"></div>
 *   <!-- 普通文章 -->
 *   <div class="sk-cards-list"></div>
 * </div>
 */
/**
 * 创建博文卡片
 */
const createCards = () => {
  const cards = _dts.ctBox('sk-cards');
  // if (isHomePage()) {
  //   bindCardsOfHome(cards);
  // }
  // if (isCateDetailPage() || isArchivePage() || isCollectionsPage()) {
  //   bindCardsOfEntry(cards);
  // }
  if (isPostDayPage()) {
    bindCardsOfHome(cards);
  } else if (isEntryPage()) {
    bindCardsOfEntry(cards);
  }

  return cards;
};

export default createCards;
