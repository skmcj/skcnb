import { skixivDefaultConfig } from '@/themes/config';
import { commentLink, myPostLink, rankCommentLink, rankLikeLink, rankViewLink } from '@/utils/cnblogUtil';
import { _dts } from '@/utils/domUtil';
/**
 * 最新随笔 - sidebar_recentposts
 * 最新评论 - sidebar_recentcomments
 * 我的标签 - sidebar_toptags
 * 常用链接 - sidebar_shortcut
 * 推荐排行 - sidebar_topdiggedposts
 * 评论排行 - sidebar_topcommentedposts
 * 阅读排行 - sidebar_topviewedposts
 * 随笔分类|随笔档案 - sidebar_categories(sidebar_postcategory|sidebar_postarchive)
 */

const silderItemMap = {
  recentposts: { name: '最新随笔', id: 'sidebar_recentposts' },
  recentcomments: { name: '最新评论', id: 'sidebar_recentcomments' },
  topdigged: { name: '推荐排行', id: 'TopDiggPostsBlock' },
  topcommented: { name: '评论排行', id: 'TopFeedbackPostsBlock' },
  topviewed: { name: '阅读排行', id: 'TopViewPostsBlock' }
};

/** 底部信息项结构 */
export interface BtMessItem {
  type: 'icon' | 'text';
  text: string;
  url?: string;
  desc?: string;
  at?: string;
}

export interface BtMess {
  title: string;
  list: BtMessItem[];
  url?: string;
  asyncBind?: (cb?: (list: BtMessItem[]) => void) => void;
}

interface SilderWidgets {
  sideColumn: string;
  topLists: string;
}

let widgets: SilderWidgets | null = null;

function getWidgets<K extends keyof SilderWidgets>(key: K) {
  return new Promise<SilderWidgets[K]>((resolve, reject) => {
    if (widgets) resolve(widgets[key]);
    else {
      const categoryEntry = window.categoryEntry;
      $.ajax({
        url: window.getAjaxBaseUrl() + 'widgets',
        data: {
          pcid: categoryEntry && categoryEntry.categoryId ? categoryEntry.categoryId : undefined,
          pct: categoryEntry && categoryEntry.categoryType ? categoryEntry.categoryType : undefined
        },
        type: 'get',
        dataType: 'json',
        success: data => {
          widgets = data;
          resolve(data[key]);
        },
        error: err => {
          reject(err);
        }
      });
    }
  });
}

/**
 * 获取最新随笔信息
 */
const getRecentPosts = () => {
  const list: BtMessItem[] = [];
  const dom = _dts.getElById(silderItemMap['recentposts'].id);
  if (dom) {
    const liDom = _dts.getElByTag('li', dom);
    try {
      for (let i = 0; i < liDom.length; i++) {
        const item: BtMessItem = {
          type: 'icon',
          text: clearNoText(liDom[i].innerText)
        };
        item.url = getHref(liDom[i].innerHTML);
        list.push(item);
      }
    } catch (e) {
      // console.warn('最新随文获取失败');
    }
  }
  return list;
};
// 提取最新随笔数据
const extractRecentPosts = (wg: string) => {
  const list: BtMessItem[] = [];
  const tempExec = /id="sidebar_recentposts"[\s\S]*?>([\s\S]+?)<\/div>/.exec(wg);
  if (tempExec) {
    const temps = tempExec[1].match(/<li[\s\S]*?>[\s\S]+?<\/li>/g);
    if (temps) {
      try {
        for (let i = 0; i < temps.length; i++) {
          const exec = /<a[\s\S]+?href="(.+?)"[\s\S]*?>([\s\S]+?)<\/a>/.exec(temps[i]);
          if (!exec) continue;
          const item: BtMessItem = {
            type: 'icon',
            url: exec[1],
            text: clearNoText(exec[2])
          };
          list.push(item);
        }
      } catch (e) {}
    }
  }
  return list;
};
// 异步绑定最新随笔
const bindRecentPostsAsync = (cb?: (list: BtMessItem[]) => void) => {
  getWidgets('sideColumn')
    .then(data => {
      cb && cb(extractRecentPosts(data));
    })
    .catch(err => {});
};

/**
 * 获取最新评论信息
 */
const getRecentComments = () => {
  const list: BtMessItem[] = [];
  const dom = _dts.getElById(silderItemMap['recentcomments'].id);
  if (dom) {
    const titleDom = _dts.getElByCls<'li'>('recent_comment_title', dom);
    const bodyDom = _dts.getElByCls<'li'>('recent_comment_body');
    const authorDom = _dts.getElByCls<'li'>('recent_comment_author');
    try {
      for (let i = 0; i < titleDom.length; i++) {
        const item: BtMessItem = {
          type: 'text',
          text: clearNoText(titleDom[i].innerText)
        };
        item.url = getHref(titleDom[i].innerHTML);
        item.desc = bodyDom[i].innerText.trim();
        item.at = clearPrefix(authorDom[i].innerText);
        list.push(item);
      }
    } catch (e) {
      // console.warn('最新评论获取失败');
    }
  }
  return list;
};
const extractRecentComments = (wg: string) => {
  const list: BtMessItem[] = [];
  const tempExec = /id="sidebar_recentcomments"[\s\S]*?>([\s\S]+?)<\/div>/.exec(wg);
  if (tempExec) {
    const titleMatchs = tempExec[1].match(/class="recent_comment_title"[\s\S]*?>[\s\S]+?<\/li>/g);
    const bodyMatchs = tempExec[1].match(/class="recent_comment_body"[\s\S]*?>[\s\S]+?<\/li>/g);
    const authorMatchs = tempExec[1].match(/class="recent_comment_author"[\s\S]*?>[\s\S]+?<\/li>/g);
    if (titleMatchs) {
      try {
        for (let i = 0; i < titleMatchs.length; i++) {
          const titleExec = /<a[\s\S]+?href="(.+?)"[\s\S]*?>([\s\S]+?)<\/a>/.exec(titleMatchs[i]);
          if (!titleExec) continue;
          const item: BtMessItem = {
            type: 'text',
            url: titleExec[1],
            text: clearNoText(titleExec[2])
          };
          if (bodyMatchs && bodyMatchs[i]) {
            const bodyExec = />(<p>)?([\s\S]+?)(<\/p>)?[\s]*?<\/li/.exec(bodyMatchs[i]);
            bodyExec && (item.desc = bodyExec[2].trim());
          }
          if (authorMatchs && authorMatchs[i]) {
            const authorExec = />([\s\S]+?)<\/li/.exec(authorMatchs[i]);
            authorExec && (item.at = clearPrefix(authorExec[1]));
          }
          list.push(item);
        }
      } catch (e) {}
    }
  }
  return list;
};
const bindRecentCommentsAsync = (cb?: (list: BtMessItem[]) => void) => {
  getWidgets('sideColumn')
    .then(data => {
      cb && cb(extractRecentComments(data));
    })
    .catch(err => {});
};

/**
 * 获取排行榜信息
 */
const getTopData = (type: 'topdigged' | 'topcommented' | 'topviewed' = 'topdigged') => {
  return function () {
    const list: BtMessItem[] = [];
    const dom = _dts.getElById(silderItemMap[type].id);
    if (dom) {
      const liDom = _dts.getElByTag('li', dom);
      try {
        for (let i = 0; i < liDom.length; i++) {
          const item: BtMessItem = {
            type: 'icon',
            text: clearNoText(liDom[i].innerText)
          };
          item.url = getHref(liDom[i].innerHTML);
          list.push(item);
        }
      } catch (e) {}
    }
    return list;
  };
};
const extractTopData = (type: 'topdigged' | 'topcommented' | 'topviewed' = 'topdigged', wg: string) => {
  const list: BtMessItem[] = [];
  const tempReg = new RegExp(`id="${silderItemMap[type].id}"[\s\S]*?>([\s\S]+?)<\/div>`);
  const tempExec = tempReg.exec(wg);
  if (tempExec) {
    const temps = tempExec[1].match(/<li[\s\S]*?>[\s\S]+?<\/li>/g);
    if (temps) {
      try {
        for (let i = 0; i < temps.length; i++) {
          const exec = /<a[\s\S]+?href="(.+?)"[\s\S]*?>([\s\S]+?)<\/a>/.exec(temps[i]);
          if (!exec) continue;
          const item: BtMessItem = {
            type: 'icon',
            url: exec[1],
            text: clearNoText(exec[2])
          };
          list.push(item);
        }
      } catch (e) {}
    }
  }
  return list;
};
const bindTopDataAsync = (type: 'topdigged' | 'topcommented' | 'topviewed' = 'topdigged') => {
  return function (cb?: (list: BtMessItem[]) => void) {
    getWidgets('topLists')
      .then(data => {
        cb && cb(extractTopData(type, data));
      })
      .catch(err => {});
  };
};

/** 获取文章标题 */
const clearNoText = (text: string) => {
  // 1. Re:随笔标题 => Re:随笔标题
  const regEx = /^[0-9]+\.\s?(.+)/.exec(text.trim());
  if (!regEx) return text;
  return regEx[1];
};

/** 清除前缀 */
const clearPrefix = (text: string) => {
  const regEx = /^[-]*(.+)/.exec(text.trim());
  if (!regEx) return text;
  return regEx[1];
};

/** 获取链接 */
const getHref = (text: string) => {
  // href
  const regEx = /href="(.+)"/.exec(text);
  if (!regEx) return text;
  return regEx[1];
};

const btMessMap = [
  { name: '最新文章', uni: 0b10000, func: getRecentPosts, asyncBind: bindRecentPostsAsync, url: myPostLink ?? '' },
  {
    name: '最新评论',
    uni: 0b01000,
    func: getRecentComments,
    asyncBind: bindRecentCommentsAsync,
    url: commentLink ?? ''
  },
  {
    name: '阅读排行',
    uni: 0b00100,
    func: getTopData('topviewed'),
    asyncBind: bindTopDataAsync('topviewed'),
    url: rankViewLink ?? ''
  },
  {
    name: '推荐排行',
    uni: 0b00010,
    func: getTopData('topdigged'),
    asyncBind: bindTopDataAsync('topdigged'),
    url: rankLikeLink ?? ''
  },
  {
    name: '评论排行',
    uni: 0b00001,
    func: getTopData('topcommented'),
    asyncBind: bindTopDataAsync('topcommented'),
    url: rankCommentLink ?? ''
  }
];

/** 获取数据 */
export const getBtMessData = () => {
  let opt = skixivDefaultConfig.btmess;
  const themeOpt = window.themeConfig.theme as SkixivTheme;
  if (typeof themeOpt === 'object') {
    opt = themeOpt.btmess ?? opt;
  }
  const list: BtMess[] = [];
  for (const item of btMessMap) {
    if (opt & item.uni) {
      const data = item.func();
      const bt: BtMess = {
        title: item.name,
        list: data,
        url: item.url
      };
      if (!data.length) bt.asyncBind = item.asyncBind;
      list.push(bt);
    }
  }
  return list;
};
