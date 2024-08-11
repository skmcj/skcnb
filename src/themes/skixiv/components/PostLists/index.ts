import './index.scss';
import {
  isOwner,
  rankViewLink,
  rankCommentLink,
  rankLikeLink,
  isRankViewPage,
  isRankCommentPage,
  isRankLikePage,
  isRankPage,
  isCommentsPage
} from '@/utils/cnblogUtil';
import { randomCover } from '@/utils/dataUtil';
import { skixivDefaultConfig } from '@/themes/config';
import { _dts } from '@/utils/domUtil';

const cleanHandle = () => {
  if (!isOwner()) {
    $('.postDesc2 a').remove();
  }
};

const exeractOwnText = (node: Element) => {
  let value = '';
  node.childNodes.forEach(child => {
    if (child.nodeType === 3) {
      // 子节点类型为 #text
      value += child.nodeValue;
    }
  });
  return value.trim();
};

const getDateText = (text: string) => {
  const exec = /([0-9-]+\s?[0-9:]+)/.exec(text);
  return exec ? exec[1] : '';
};

const getNameText = (text: string) => {
  const exec = /([^\s]+)\s?/.exec(text);
  return exec ? exec[1].trim() : '';
};

const createStub = () => {
  const stub = _dts.ctBox('sk-stub-bg');
  return stub;
};

const createDate = (text: string) => {
  const date = _dts.ctSpan(text, 'post-date');
  return date;
};

const createAuthor = (text: string) => {
  const span = _dts.ctSpan(`by ${text}`, 'text-author');
  return span;
};

const bindCover = (dom: HTMLElement, flag: number = 0) => {
  let opt = skixivDefaultConfig.mticket as MostTicket;
  let type = opt.type;
  let prebg = opt.prebg;
  let sufbg = opt.sufbg;
  let count = opt.count;
  const themeOpt = window.themeConfig.theme as SkixivTheme;
  if (typeof themeOpt === 'object') {
    if (themeOpt.mticket) {
      const temp = themeOpt.mticket;
      temp.type && (type = temp.type);
      temp.prebg && (prebg = temp.prebg);
      temp.sufbg && (sufbg = temp.sufbg);
      temp.count && (count = temp.count);
    }
  }
  if (type === 'random') {
    randomCover('random').then(src => {
      dom.style.setProperty('--cover-bg', `url(${src})`);
    });
  } else if (type === 'daily') {
    randomCover('daily').then(src => {
      dom.style.setProperty('--cover-bg', `url(${src})`);
    });
  } else if (type === 'count') {
    randomCover('count', count).then(src => {
      dom.style.setProperty('--cover-bg', `url(${src})`);
    });
  } else {
    dom.style.setProperty('--cover-bg', `url(${flag > 0 ? sufbg : prebg})`);
  }
};

const createTab = (text: string, link: string, flag?: boolean) => {
  const tab = _dts.ctLink(link, 'sk-most-tab');
  flag && tab.classList.add('active');
  const inner = _dts.ctSpan(text);
  tab.appendChild(inner);
  return tab;
};

const createTabs = () => {
  const tabs = _dts.ctBox('sk-most-tabs');
  tabs.appendChild(createTab('阅读榜', rankViewLink, isRankViewPage()));
  tabs.appendChild(createTab('评论榜', rankCommentLink, isRankCommentPage()));
  tabs.appendChild(createTab('推荐榜', rankLikeLink, isRankLikePage()));
  return tabs;
};

/**
 * 创建
 */
const buildPostLists = () => {
  // 添加tab
  const posts = _dts.getElById('myposts');
  isRankPage() && posts && posts.parentElement?.insertBefore(createTabs(), posts);
  // 增强列表项
  const doms = _dts.getElByCls<'div'>('PostList');
  for (let i = 0; i < doms.length; i++) {
    const dom = doms[i];
    const title = _dts.getElByCls<'div'>('postTitl2', dom);
    const desc = _dts.getElByCls<'div'>('postDesc2', dom);
    // 添加票根背景
    dom.insertBefore(createStub(), dom.firstChild);
    if (desc.length) {
      const descDom = desc[0];
      let text = exeractOwnText(descDom);
      let date = getDateText(text);
      if (descDom.firstChild?.nodeType === 3) {
        descDom.removeChild(descDom.firstChild);
      }
      bindCover(descDom as HTMLElement, 1);
      if (title) {
        if (isCommentsPage()) {
          // 移动评论内容
          dom.classList.add('sk-comments-item');
          const comments = _dts.getElByCls('postText2', dom);
          if (comments.length > 0) {
            comments[0].appendChild(createAuthor(getNameText(text)));
            title[0].appendChild(comments[0]);
            // console.log(comments[0]);
          }
        }
        date && title[0].appendChild(createDate(date));
        bindCover(title[0] as HTMLElement);
      }
      const spans = descDom.getElementsByTagName('span');
      for (let k = 0; k < spans.length; k++) {
        let spanText = spans[k].innerText;
        spanText = spanText.replace(/\(|:/, '-');
        spanText = spanText.replaceAll(/[\)\s]/g, '');
        spans[k].innerText = spanText;
      }
    }
  }
  cleanHandle();
};

export default buildPostLists;
