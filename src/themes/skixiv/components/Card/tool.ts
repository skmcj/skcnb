import { isArchiveMonthPage, isCateDetailPage, isEntryPage } from '@/utils/cnblogUtil';
import { _dts } from '@/utils/domUtil';

/** 文章数据 */
export interface ArticleData {
  id?: string;
  /** 是否置顶 */
  pinned?: boolean;
  title: string;
  desc: string;
  cover?: string;
  /** 详情链接 */
  url: string;
  /** 编辑链接 */
  editUrl?: string;
  /** 日期链接 */
  dayUrl?: string;
  /** 仅登录用户可见 */
  visible?: boolean;
  /** 作者 */
  author?: string;
  /** 日期 */
  date?: string;
  /** 时间 */
  time?: string;
  /** 阅读量 */
  viewCount: string;
  /** 评论量 */
  commentCount: string;
  /** 推荐量 */
  diggCount: string;
}

export interface EntryTitleData {
  title: string;
  desc?: string;
  url?: string;
}

type PageType = 'home' | 'entry';

const pinnedClass = 'pinned';

/** 正则匹配提取Id */
const getId = (text: string) => {
  const temp = /.+postid=([0-9a-zA-Z_-]+)/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取标题 */
const getTitle = (text: string) => {
  const temp = /\[?置?顶?\]?\s?(.+)/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取desc */
const getDesc = (text: string) => {
  const temp = /\s*?摘要：\s*(.+)\s+阅?/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取Date*/
const getDate = (text: string) => {
  const temp = /([0-9]+-[0-9]+-[0-9]+)/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取Time */
const getTime = (text: string) => {
  const temp = /([0-9]+:[0-9]+)/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取Author */
const getAuthor = (text: string) => {
  const temp = /:[0-9]+\s+(.+?)\s+/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取ViewCount */
const getViewCount = (text: string) => {
  const temp = /阅读\(([0-9]+)\)/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取CommentCount */
const getCommentCount = (text: string) => {
  const temp = /评论\(([0-9]+)\)/.exec(text);
  return temp ? temp[1] : text;
};

/** 正则匹配提取DiggCount */
const getDiggCount = (text: string) => {
  const temp = /推荐\(([0-9]+)\)/.exec(text);
  return temp ? temp[1] : text;
};

/** 获取标签href */
const getLinkByA = (el: HTMLElement) => {
  const temp = _dts.getElByTag('a', el);
  return temp.length > 0 ? temp[0].href : '';
};

/** 获取图片链接 */
const getImageByClass = (el: HTMLElement, cls: string) => {
  const temp = _dts.getElByCls<'img'>(cls, el);
  return temp.length > 0 ? temp[0].src : '';
};

/** 获取两家链接 */
const getLinkByQuery = (el: HTMLElement, query: string) => {
  const temp = el.querySelector(query) as HTMLAnchorElement;
  return temp ? temp.href : '';
};

const extractTitleData = (res: ArticleData, temp: HTMLDivElement) => {
  const pEl = _dts.getElByCls('pinned-post-mark', temp);
  pEl.length > 0 && (res.pinned = true);
  res.url = getLinkByA(temp);
  res.title = getTitle(temp.innerText.trim());
};

const extractConData = (res: ArticleData, temp: HTMLDivElement) => {
  res.desc = getDesc(temp.innerText);
  res.cover = getImageByClass(temp, 'desc_img');
};

const extractDescData = (res: ArticleData, temp: HTMLDivElement) => {
  const text = temp.innerText;
  res.date = getDate(text);
  res.time = getTime(text);
  res.author = getAuthor(text);
  res.editUrl = getLinkByQuery(temp, 'a:last-child');
  res.id = getId(res.editUrl);
  res.viewCount = getViewCount(text);
  res.commentCount = getCommentCount(text);
  res.diggCount = getDiggCount(text);
};

/** 获取文章数据 */
export const getArticleData = (el: HTMLElement, type: PageType = 'home') => {
  let findClass = ['dayTitle', 'postTitle', 'postCon', 'postDesc'];
  if (type === 'entry') {
    findClass = ['', 'entrylistPosttitle', 'entrylistPostSummary', 'entrylistItemPostDesc'];
  }
  const resList: ArticleData[] = [];

  const tEl = _dts.getElByCls<'div'>(findClass[1], el);
  const conEl = _dts.getElByCls<'div'>(findClass[2], el);
  const descEl = _dts.getElByCls<'div'>(findClass[3], el);

  if (type === 'entry') {
    const res: ArticleData = {
      title: '',
      desc: '',
      url: '',
      viewCount: '0',
      commentCount: '0',
      diggCount: '0'
    };
    // postTitle: title | url
    tEl.length > 0 && extractTitleData(res, tEl[0]);
    // postCon: desc | cover
    conEl.length > 0 && extractConData(res, conEl[0]);
    // postDesc: date | author | id | editUrl | *Count
    descEl.length > 0 && extractDescData(res, descEl[0]);
    // 类别页
    if (res.date) {
      res.dayUrl = `https://www.cnblogs.com/${window.currentBlogApp}/p/archive/${res.date.split('-').join('/')}`;
    }
    resList.push(res);
  } else {
    const dtEl = _dts.getElByCls<'div'>(findClass[0], el);
    for (let i = 0; i < tEl.length; i++) {
      const res: ArticleData = {
        title: '',
        desc: '',
        url: '',
        viewCount: '0',
        commentCount: '0',
        diggCount: '0'
      };
      // postTitle: title | url
      extractTitleData(res, tEl[i]);
      // postCon: desc | cover
      conEl[i] && extractConData(res, conEl[i]);
      // postDesc: date | author | id | editUrl | *Count
      descEl[i] && extractDescData(res, descEl[i]);
      // 获取日期URL
      dtEl.length > 0 && (res.dayUrl = getLinkByA(dtEl[0]));
      resList.push(res);
    }
  }

  return resList;
};
/** 获取文章列表数据 */
export const getArticlesData = (type: PageType = 'home') => {
  let itemClass = 'day';
  if (type === 'entry') {
    itemClass = 'entrylistItem';
  }
  const data: ArticleData[] = [];
  const els = _dts.getElByCls<'div'>(itemClass);
  for (let i = 0; i < els.length; i++) {
    data.push(...getArticleData(els[i] as HTMLElement, type));
  }
  return data;
};

/** 获取分类标题 */
export const getEntryTitleData = () => {
  const list: EntryTitleData[] = [];
  if (isCateDetailPage()) {
    const entryDom = _dts.getElByCls<'a'>('category-crumb-item');
    for (let i = 0; i < entryDom.length; i++) {
      const item: EntryTitleData = {
        title: entryDom[i].innerText.trim(),
        desc: entryDom[i].getAttribute('title') ?? '',
        url: entryDom[i].getAttribute('href') ?? ''
      };
      list.push(item);
    }
  } else {
    const entryDom = _dts.getElByCls<'h1'>('entrylistTitle');
    if (entryDom.length > 0) {
      let text = entryDom[0].innerText.trim();
      if (isArchiveMonthPage()) {
        const exec = /([0-9]+)\s+?([0-9]+)/.exec(text);
        exec && (text = `档案|${exec[2]}-${exec[1]}`);
      }
      const item: EntryTitleData = {
        title: text
      };
      list.push(item);
    }
  }

  return list;
};

/** 获取分类标题 */
export const getArchiveTitleData = () => {
  const list: EntryTitleData[] = [];
  const exec = /([0-9]+)\/([0-9]+)\/([0-9]+)/.exec(location.pathname);
  if (exec) {
    const monthItem: EntryTitleData = {
      title: `档案|${exec[1]}-${exec[2]}`,
      url: `https://www.cnblogs.com/${window.currentBlogApp}/p/archive/${exec[1]}/${exec[2]}`
    };
    const dayItem: EntryTitleData = {
      title: `${exec[3]}`
    };
    list.push(monthItem);
    list.push(dayItem);
  }
  return list;
};
