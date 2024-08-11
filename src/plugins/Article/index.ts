import { execSrc, execPostId } from '@/utils/domUtil';
import { blogName } from '@/utils/cnblogUtil';
import { getCurrentHref } from '@/utils/commonUtil';
import { _dts } from '@/utils/domUtil';

/** 文章标签 */
export interface ArticleTag {
  name: string;
  // 链接
  url: string;
}

/** 文章类别 */
export interface ArticleCate {
  name: string;
  // 链接
  url: string;
}

/** 文章信息 */
export interface ArticleInfo {
  id?: number;
  // 作者
  author: string;
  // 链接
  url: string;
  // 标题
  title: string;
  // 描述
  desc?: string;
  // 封面
  cover?: string;
  // 类别
  cates: ArticleCate[];
  // 标签
  tags: ArticleTag[];
  // 推荐
  digg: string;
  // 评论
  comment: string;
  // 阅读
  view: string;
  // 踩
  bury: string;
  // 日期
  date?: string;
  time?: string;

  // MD链接
  md?: string;
  // 编辑链接
  edit?: string;
}

/** 上下篇 */
export interface ArticleCard {
  title: string;
  url: string;
  cover?: string;
  date?: string;
  time?: string;
}

export interface ArticlePrevNext {
  prev?: ArticleCard;
  next?: ArticleCard;
}

/** 获取文章标签 */
const getArticleTags = () => {
  const tags: ArticleTag[] = [];
  const dom = _dts.getElById('EntryTag');
  if (dom) {
    const tagsDom = dom.getElementsByTagName('a');
    for (let i = 0; i < tagsDom.length; i++) {
      const tag: ArticleTag = {
        name: tagsDom[i].text,
        url: tagsDom[i].href
      };
      tags.push(tag);
    }
  }
  return tags;
};

/** 获取文章类别 */
const getArticleCates = () => {
  const cates: ArticleCate[] = [];
  const dom = _dts.getElById('BlogPostCategory');
  if (dom) {
    const catesDom = dom.getElementsByTagName('a');
    for (let i = 0; i < catesDom.length; i++) {
      const cate: ArticleCate = {
        name: catesDom[i].text,
        url: catesDom[i].href
      };
      cates.push(cate);
    }
  }
  return cates;
};

/** 获取文章ID */
const getArticleId = () => {
  return window.cb_entryId ? window.cb_entryId : void 0;
};

/** 获取文章标题 */
const getArticleTitle = () => {
  if (window.cb_postTitle) return window.cb_postTitle;
  const titleDom = _dts.getElById('cb_post_title_url');
  if (titleDom) return titleDom.innerText;
  return '标题加载出错了呢';
};

/** 获取文章描述和封面 */
const getDescAndCover = () => {
  const dom = _dts.getElById('cnblogs_post_description');
  let desc, cover;
  if (dom) {
    desc = dom.innerText.trim();
    let src = execSrc(dom.innerHTML);
    if (src) cover = src;
  }
  return {
    desc,
    cover
  };
};

/** 获取文章日期和时间 */
const getDateAndTime = () => {
  let str = window.cb_entryCreatedDate;
  if (!str) {
    const dom = _dts.getElById('post-date');
    if (dom) str = dom.innerText;
  }
  let date, time;
  if (str) {
    let tmp = str.split(' ');
    date = tmp[0];
    if (tmp.length > 1) time = tmp[1];
  }
  return {
    date,
    time
  };
};

/** 获取 MD 链接 */
const getArticleMd = () => {
  const dom = _dts.getElByCls('postDesc');
  if (!dom.length) return void 0;
  const exec = /href="(.+(p|articles)\/.+\.md)"/.exec(dom[0].innerHTML);
  return exec ? exec[1] : void 0;
};

/** 获取 编辑 链接 */
const getArticleEdit = () => {
  const dom = _dts.getElByCls('postDesc');
  if (!dom.length) return void 0;
  const exec = /href="(https:\/\/i\.cnblogs\.com\/Edit(Posts|Articles)\.aspx\?postid=.+?)"/.exec(dom[0].innerHTML);
  return exec ? exec[1] : void 0;
};

const getViewCount = () => {
  const dom = _dts.getElById('post_view_count');
  return dom ? dom.innerText : '';
};
const getCommentCount = () => {
  const dom = _dts.getElById('post_comment_count');
  return dom ? dom.innerText : '';
};
const getDiggCount = () => {
  const dom = _dts.getElById('digg_count');
  return dom ? dom.innerText : '';
};
const getBuryCount = () => {
  const dom = _dts.getElById('bury_count');
  return dom ? dom.innerText : '';
};

/** 获取上下篇信息 */
const getPNDesc = (el: HTMLAnchorElement) => {
  const dc: ArticleCard = {
    title: el.innerText.trim(),
    url: el.getAttribute('href') ?? '#',
    cover: el.getAttribute('data-featured-image') ?? void 0
  };
  const dateStr = el.getAttribute('title');
  if (dateStr) {
    const exec = /([0-9-]+)\s?([0-9]+:[0-9]+)?/.exec(dateStr);
    if (exec) {
      dc.date = exec[1];
      dc.time = exec[2];
    }
  }
  return dc;
};

interface PostStats {
  postId: number;
  viewCount: number;
  feedbackCount: number;
  diggCount: number;
  buryCount: number;
}

interface Accessories {
  categoriesTags: string;
  postInfo: string;
  prevNext: string;
  postStats: PostStats;
  headlines: string;
  historyToday: string;
}

// 文章信息缓存
let accessoriesCache: Accessories | null = null;
/** 获取文章信息 */
function getPostAccessories<T extends keyof Accessories>(key: T) {
  return new Promise<Accessories[T]>((resolve, reject) => {
    if (accessoriesCache) resolve(accessoriesCache[key]);
    else {
      $.ajax({
        url: window.getAjaxBaseUrl() + `post-accessories?postId=${window.cb_entryId}`,
        dataType: 'json',
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          accessoriesCache = data;
          resolve(data[key]);
        },
        error: function (xhr) {
          reject('发生错误！麻烦反馈至contact@cnblogs.com');
        }
      });
    }
  });
}

/** 正则提取 */

// 提取上or下篇数据
const extractPNDC = function (cnt: string) {
  const titleExec = />(.+?)<\/a>/.exec(cnt);
  const urlExec = /href="(.+?)"/.exec(cnt);
  const coverExec = /data-featured-image="([^\s"]+?)"/.exec(cnt);
  const dc: ArticleCard = {
    title: titleExec ? titleExec[1].trim() : '',
    url: urlExec ? urlExec[1] : '#',
    cover: coverExec ? coverExec[1] : void 0
  };
  const dateExec = /title="(.+?)"/.exec(cnt);
  const dateStr = dateExec ? dateExec[1] : void 0;
  if (dateStr) {
    const exec = /([0-9-]+)\s?([0-9]+:[0-9]+)?/.exec(dateStr);
    if (exec) {
      dc.date = exec[1];
      dc.time = exec[2];
    }
  }
  return dc;
};
// 提取上下篇数据
const extractPrevNext = function (cnt: string) {
  const execPrev = /上一篇[\s\S]+?(<a[\s\S]+?<\/a>)/.exec(cnt);
  const execNext = /下一篇[\s\S]+?(<a[\s\S]+?<\/a>)/.exec(cnt);
  if (!execPrev && !execNext) return void 0;
  const articles: ArticlePrevNext = {};
  articles.prev = execPrev ? extractPNDC(execPrev[1]) : void 0;
  articles.next = execNext ? extractPNDC(execNext[1]) : void 0;
  return articles;
};
// 提取标签数据
const extractTags = function (cnt: string) {
  const tags: ArticleTag[] = [];
  const tagExec = /id="EntryTag">([\s\S]+?)<\/div>/.exec(cnt);
  if (tagExec) {
    let exec: RegExpExecArray | null = null;
    const reg = /<a[\s\S]*?href="(.+?)"[\s\S]*?>([\s\S]+?)<\/a>/g;
    while ((exec = reg.exec(tagExec[1]))) {
      const tag: ArticleTag = {
        url: exec[1].trim(),
        name: exec[2].trim()
      };
      tags.push(tag);
    }
  }
  return tags;
};
// 提取类别数据
const extractCates = function (cnt: string) {
  const cates: ArticleCate[] = [];
  const cateExec = /id="BlogPostCategory">([\s\S]+?)<\/div>/.exec(cnt);
  if (cateExec) {
    let exec: RegExpExecArray | null = null;
    const reg = /<a[\s\S]*?href="(.+?)"[\s\S]*?>([\s\S]+?)<\/a>/g;
    while ((exec = reg.exec(cateExec[1]))) {
      const cate: ArticleCate = {
        url: exec[1].trim(),
        name: exec[2].trim()
      };
      cates.push(cate);
    }
  }
  return cates;
};

/** 显示类别 */
export const showCates = function (cb?: Function) {
  getPostAccessories('categoriesTags')
    .then(cnt => {
      const cates = extractCates(cnt);
      cb && cb(cates);
    })
    .catch(err => {
      console.warn('Error: show tags error\n' + err);
    });
};

/** 显示标签 */
export const showTags = function (cb?: Function) {
  getPostAccessories('categoriesTags')
    .then(cnt => {
      const tags = extractTags(cnt);
      cb && cb(tags);
    })
    .catch(err => {
      console.warn('Error: show tags error\n' + err);
    });
};

/**
 * 显示上下文
 * @param cb
 */
export const showPrevNext = function (cb?: Function) {
  getPostAccessories('prevNext')
    .then(pn => {
      cb && cb(extractPrevNext(pn));
    })
    .catch(err => {
      console.warn('Error: update prevNext error\n' + err);
    });
};

/** 更新文章状态 */
export const updatePostStats = function () {
  getPostAccessories('postStats')
    .then(stats => {
      setPostDiggCount(stats.diggCount);
      setPostBuryCount(stats.buryCount);
      setPostCommentCount(stats.feedbackCount);
      setPostViewCount(stats.viewCount);
    })
    .catch(err => {
      console.warn('Error: update post stats error\n' + err);
    });
};

/** 设置文章阅读数 */
export const setPostViewCount = function (count?: number) {
  count = count ?? 0;
  const cts = _dts.getElByCls<'span'>('post_view_count');
  for (let i = 0; i < cts.length; i++) {
    cts[i].innerText = `${count}`;
  }
};

/** 设置文章点赞数 */
export const setPostDiggCount = function (count?: number) {
  count = count ?? 0;
  const cts = _dts.getElByCls<'span'>('post_digg_count');
  for (let i = 0; i < cts.length; i++) {
    cts[i].innerText = `${count}`;
  }
};

/** 设置文章反对数 */
export const setPostBuryCount = function (count?: number) {
  count = count ?? 0;
  const cts = _dts.getElByCls<'span'>('post_bury_count');
  for (let i = 0; i < cts.length; i++) {
    cts[i].innerText = `${count}`;
  }
};

/** 设置文章评论数 */
export const setPostCommentCount = function (count?: number) {
  count = count ?? 0;
  const cts = _dts.getElByCls<'span'>('post_comment_count');
  for (let i = 0; i < cts.length; i++) {
    cts[i].innerText = `${count}`;
  }
};

/** 获取文章信息 */
export const getArticleInfo = () => {
  const info: ArticleInfo = {
    id: getArticleId(),
    author: blogName(),
    url: getCurrentHref(),
    title: getArticleTitle(),
    cates: getArticleCates(),
    tags: getArticleTags(),
    digg: getDiggCount(),
    view: getViewCount(),
    comment: getCommentCount(),
    bury: getBuryCount(),
    edit: getArticleEdit(),
    md: getArticleMd()
  };
  let descAndCover = getDescAndCover();
  info.desc = descAndCover.desc;
  info.cover = descAndCover.cover;
  let dateAndTime = getDateAndTime();
  info.date = dateAndTime.date;
  info.time = dateAndTime.time;
  // id为空，从编辑链接取
  if (!info.id && info.edit) {
    info.id = execPostId(info.edit);
  }

  return info;
};

/** 获取文章上一篇和下一篇 */
export const getPrevAndNext = () => {
  const articles: ArticlePrevNext = {};
  let contextFlag = false;
  const dom = _dts.getElById('post_next_prev');
  if (dom) {
    const adoms = dom.getElementsByTagName('a');
    // 有四种可能
    // 1.都没有
    if (adoms.length > 1) {
      contextFlag = true;
      if (adoms.length < 4) {
        const br = dom.getElementsByTagName('br');
        if (!br.length) {
          // 2.只有上一篇
          articles.prev = getPNDesc(adoms[1]);
        } else {
          // 3.只有下一篇
          articles.next = getPNDesc(adoms[1]);
        }
      } else {
        // 4.都有
        articles.prev = getPNDesc(adoms[1]);
        articles.next = getPNDesc(adoms[3]);
      }
    }
  }
  return contextFlag ? articles : void 0;
};
