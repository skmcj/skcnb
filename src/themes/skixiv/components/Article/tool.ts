import { randomRGBP } from '../../hook/useColor';
import { handleFollow, handleVote } from '../../hook/useState';
import {
  type ArticleInfo,
  type ArticleTag,
  type ArticlePrevNext,
  type ArticleCard,
  showPrevNext,
  showTags
} from '@/plugins/Article';
import { getFollowState, isOwner, isRewardPage, rewardLink } from '@/utils/cnblogUtil';
import { randomCover } from '@/utils/dataUtil';
import { _dts } from '@/utils/domUtil';

/**
 * categoriesTags
 * postStats: {
 *   "postId": 18132201,
 *   "viewCount": 9,
 *   "feedbackCount": 7,
 *   "diggCount": 1,
 *   "buryCount": 0
 *   }
 * prevNext
 */

// 标签
const createTag = (data: ArticleTag) => {
  const tag = _dts.ctBox('sk-post-tag');
  const rgb = randomRGBP();
  tag.style.color = rgb.origin;
  tag.style.backgroundColor = rgb.alpha;
  tag.style.borderColor = rgb.origin;
  const icon = _dts.ctIcon('ib-label');
  const text = _dts.ctSpan(data.name);
  tag.appendChild(icon);
  tag.appendChild(text);
  if (!data.url) return tag;
  const link = _dts.ctLink(data.url);
  link.setAttribute('target', '_blank');
  link.appendChild(tag);
  return link;
};
const createTags = (data: ArticleTag[]) => {
  const tags = _dts.ctBox('sk-post-tags');
  for (let i = 0; i < data.length; i++) {
    const tag = createTag(data[i]);
    tags.appendChild(tag);
  }
  return tags;
};

// 底部阅读信息
const createMessItem = (icon?: string, text?: string, url?: string, title?: string) => {
  const item = _dts.ctBox();
  title && item.setAttribute('title', title);
  if (icon) {
    const i = _dts.ctIcon(icon);
    item.appendChild(i);
  }
  if (text) {
    const span = _dts.ctSpan(text, 'post_view_count');
    item.appendChild(span);
  }
  if (url) {
    const link = _dts.ctLink(url, 'sk-post-btmess-item');
    link.setAttribute('target', '_blank');
    link.appendChild(item);
    return link;
  }
  item.classList.add('sk-post-btmess-item');
  return item;
};

const createViewMessItem = (text: string) => {
  const item = _dts.ctBox('sk-post-btmess-item');
  const i = _dts.ctIcon('ib-view');
  item.appendChild(i);
  const content = _dts.ctSpan('已阅读了 ');
  const span = _dts.ctSpan(text, 'post_view_count');
  content.appendChild(span);
  content.appendChild(_dts.ctText(' 次'));
  item.appendChild(content);
  return item;
};
const createBtMess = (data: ArticleInfo) => {
  const vm = _dts.ctBox('sk-post-btmess');
  vm.appendChild(createViewMessItem(data.view));
  data.md && vm.appendChild(createMessItem('ib-md', '', data.md, 'Markdown'));
  isOwner() && data.edit && vm.appendChild(createMessItem('ib-edit-4', '', data.edit, '编辑'));
  !isRewardPage() && vm.appendChild(createMessItem('ib-money', '', rewardLink, '投喂'));
  return vm;
};
// 点赞等工具
const createChannelBtn = (icon: string, text: string, id?: string, cls?: string) => {
  const btn = _dts.ctBox('channel-btn');
  const i = _dts.ctIcon(icon);
  const span = _dts.ctSpan(text);
  id && span.setAttribute('id', id);
  cls && span.setAttribute('class', cls);
  btn.appendChild(i);
  btn.appendChild(span);
  return btn;
};
const createChannel = (data: ArticleInfo) => {
  const channel = _dts.ctBox('sk-post-channel');
  // 关注按钮
  const followBtn = createChannelBtn('ib-heart', '');
  followBtn.classList.add('is-follow');
  followBtn.onclick = function () {
    handleFollow();
  };
  if (getFollowState()) {
    followBtn.classList.remove('is-follow');
    followBtn.classList.add('is-unfollow');
  } else {
    followBtn.classList.remove('is-unfollow');
    followBtn.classList.add('is-follow');
  }
  // 收藏
  const collectBtn = createChannelBtn('ib-star-line', '收藏');
  collectBtn.onclick = function () {
    AddToWz(window.cb_entryId);
  };
  // 推荐
  const diggBtn = createChannelBtn('ib-digg', data.digg, 'digg-count', 'post_digg_count');
  diggBtn.onclick = function () {
    handleVote(data.id, 'Digg');
  };
  // 踩
  const buryBtn = createChannelBtn('ib-digg', data.bury, 'bury-count', 'post_bury_count');
  buryBtn.onclick = function () {
    handleVote(data.id, 'Bury');
  };
  buryBtn.classList.add('bury');
  channel.appendChild(followBtn);
  channel.appendChild(collectBtn);
  channel.appendChild(diggBtn);
  channel.appendChild(buryBtn);
  return channel;
};
// 版权信息
const createSignatureItem = (icon: string, title: string, content: string) => {
  const item = _dts.ctBox('sk-post-signitem');
  const i = _dts.ctIcon(icon);
  const tit = _dts.ctSpan(`${title}：`, 'title');
  const text = _dts.ctSpan(content, 'text');
  item.appendChild(i);
  item.appendChild(tit);
  item.appendChild(text);
  return item;
};
const createSignature = (author: string, url: string) => {
  // 作者、链接、版权
  const sign = _dts.ctBox('sk-post-signature');
  sign.appendChild(createSignatureItem('ib-author', '本文作者', author));
  sign.appendChild(createSignatureItem('ib-link', '本文链接', url));
  sign.appendChild(
    createSignatureItem(
      'ib-cra',
      '版权声明',
      '本作品采用知识共享署名-非商业性使用-禁止演绎 2.5 中国大陆许可协议进行许可。'
    )
  );
  return sign;
};
// 上下篇
const createConItem = (data: ArticleCard, type: 'next' | 'prev') => {
  const item = _dts.ctBox(`sk-post-con-${type}`);
  const span = _dts.ctSpan(type === 'next' ? '下一篇' : '上一篇', 'tag');
  const cover = _dts.ctBox('cover');
  const img = _dts.ctImg();
  if (data.cover) {
    img.setAttribute('src', data.cover);
  } else {
    randomCover().then(url => {
      img.setAttribute('src', url);
    });
  }
  cover.appendChild(img);
  const title = _dts.ctSpan(data.title, 'title');
  cover.appendChild(title);
  item.appendChild(span);
  item.appendChild(cover);
  const link = _dts.ctLink(data.url, 'sk-post-link');
  link.setAttribute('title', data.title);
  link.appendChild(item);
  return link;
};
const createContext = (pn: ArticlePrevNext) => {
  const context = _dts.ctBox('sk-post-context');
  pn.prev && context.appendChild(createConItem(pn.prev, 'prev'));
  pn.next && context.appendChild(createConItem(pn.next, 'next'));
  return context;
};

/**
 *
 * @param cfn 二进制数(0-无;1-有)[标签|文末信息|点赞收藏|版权声明]
 * @param info
 * @param context
 * @returns
 */
export const createBottomMess = (cfn: number, info: ArticleInfo, context?: ArticlePrevNext) => {
  const bottomMess = _dts.ctBox('sk-post-bottom');
  if (cfn & 0b0001) {
    if (info.tags.length > 0) bottomMess.appendChild(createTags(info.tags));
    else {
      showTags((tags: ArticleTag[]) => {
        bottomMess.insertBefore(createTags(tags), bottomMess.firstChild);
      });
    }
  }
  bottomMess.appendChild(_dts.ctEl('hr'));
  cfn & 0b0010 && bottomMess.appendChild(createBtMess(info));
  cfn & 0b0100 && bottomMess.appendChild(createChannel(info));
  cfn & 0b1000 && bottomMess.appendChild(createSignature(info.author, info.url));
  if (context) bottomMess.appendChild(createContext(context));
  else {
    showPrevNext((pn: ArticlePrevNext) => {
      bottomMess.appendChild(createContext(pn));
    });
  }

  return bottomMess;
};
