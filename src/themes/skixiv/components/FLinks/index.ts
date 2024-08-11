import './index.scss';
import { CommentManager } from '@/plugins/Comment';
import { getArticleInfo, updatePostStats } from '@/plugins/Article';
import type { ArticleInfo } from '@/plugins/Article';
import { createBottomMess } from '../Article/tool';
import { setBrand, setCover } from '../../hook/useBrand';
import { _dts } from '@/utils/domUtil';

interface FLinkItem {
  // 网址
  url: string;
  // 网站名称
  site: string;
  // 昵称
  name: string;
  // 简短描述
  desc?: string;
  // 一张图片
  avatar?: string;
  // 主题色
  color?: string;
  // 站点截图
  page?: string;
  // 标签
  label?: string;
}

// 清理内容
const clearBody = () => {
  const body = _dts.getElById('cnblogs_post_body');
  body && (body.textContent = '');
};

// 解析友链
const parseLinks = (id: string) => {
  let json: FLinkItem[] = [];
  try {
    const linksDOM = _dts.getElById(id);
    if (linksDOM) {
      const code = _dts.getElByTag('pre', linksDOM);
      code.length > 0 && (json = JSON.parse(code[0].innerText));
    }
  } catch (err) {}
  return json;
};

const parseLinksTitle = (id: string) => {
  let title = '';
  const dom = _dts.getElById(id);
  if (dom) {
    const tit = _dts.getElByTag('h2', dom);
    tit.length > 0 && (title = tit[0].innerText.trim());
  }
  return title;
};

const parseLinksP = (id: string) => {
  let text = '';
  const dom = _dts.getElById(id);
  if (dom) {
    const p = _dts.getElByTag('p', dom);
    p.length > 0 && (text = p[0].innerText.trim());
  }
  return text;
};

// 推荐博客项
const createPLinkCard = (data: FLinkItem) => {
  const card = _dts.ctBox('sk-pflink');
  card.setAttribute('title', data.name);
  // page
  const page = _dts.ctBox('page');
  const inner = _dts.ctBox('page-inner');
  // tab
  const tab = _dts.ctBox('tab-section');
  const icons = _dts.ctBox('icons');
  const tag = _dts.ctBox('tag');
  data.label && tag.appendChild(_dts.ctSpan(data.label));
  icons.appendChild(tag);
  const tools = _dts.ctBox('tools');
  tools.appendChild(_dts.ctIcon('ib-minisize'));
  tools.appendChild(_dts.ctIcon('ib-reset'));
  tools.appendChild(_dts.ctIcon('ib-close-2'));
  icons.appendChild(tools);
  tab.appendChild(_dts.ctBox('border'));
  tab.appendChild(icons);
  // cover

  const cover = _dts.ctBox();
  if (data.page) {
    const img = _dts.ctImg(data.page);
    cover.appendChild(img);
  }
  inner.appendChild(tab);
  if (data.url) {
    const link = _dts.ctLink(data.url, 'sk-flink-a cover');
    link.setAttribute('target', '_blank');
    link.appendChild(cover);
    inner.appendChild(link);
  } else {
    cover.classList.add('cover');
    inner.appendChild(cover);
  }
  page.appendChild(inner);
  // info
  const info = _dts.ctBox('info');
  const avatar = _dts.ctBox('avatar');
  avatar.setAttribute('title', data.name);
  avatar.appendChild(_dts.ctImg(data.avatar));
  const mess = _dts.ctBox('mess');
  mess.appendChild(_dts.ctSpan(data.site, 'name'));
  mess.appendChild(_dts.ctSpan(data.desc, 'desc'));
  info.appendChild(avatar);
  info.appendChild(mess);
  card.appendChild(page);
  card.appendChild(info);
  return card;
};

// 创建推荐博客
const buildPLinks = () => {
  const plinks = _dts.getElById('skPFLinks');
  if (!plinks) return;
  plinks.classList.add('sk-pflinks');
  plinks.style.display = 'none';
  const data = parseLinks('skPFLinks');
  const tit = parseLinksTitle('skPFLinks') || '推荐博客';
  const title = _dts.ctTitle(tit, 2);
  const list = _dts.ctBox('sk-flink-list');
  for (let i = 0; i < data.length; i++) {
    const item = createPLinkCard(data[i]);
    list.appendChild(item);
  }
  plinks.textContent = '';
  plinks.appendChild(title);
  plinks.appendChild(list);
  plinks.style.display = 'flex';
};

const createMountain = (text?: string) => {
  const mt = _dts.ctBox('mountain');
  if (text) {
    const span = _dts.ctSpan(text);
    mt.appendChild(span);
  }
  return mt;
};

const validateGradColor = (color: string) => {
  return /linear-gradient\([0-9]{1,3}deg,\s?#[0-9a-zA-Z]{6,8},\s?#[0-9a-zA-Z]{6,8}\)/.test(color);
};

const validateColor = (color: string) => {
  return (
    /#[0-9a-zA-Z]{6,8}/.test(color) || /rgba?\([0-9]{1,3}(,\s?[0-9]{1,3}){2}(,\s?[01]?\.[0-9]{1,2})?\)/.test(color)
  );
};

// 创建友链项
const createLinkCard = (data: FLinkItem, count: number = 1) => {
  const card = _dts.ctLink(data.url, 'sk-flink');
  card.setAttribute('title', data.name);
  card.setAttribute('target', '_blank');
  const inner = _dts.ctBox('inner');
  if (data.color) {
    if (validateGradColor(data.color)) {
      inner.style.background = data.color;
    } else if (validateColor(data.color)) {
      inner.style.background = `linear-gradient(135deg, ${data.color}, #57ca85)`;
    }
  }
  // 头像
  const avatarBox = _dts.ctBox('avatar-box circle csd');
  const avatar = _dts.ctBox('avatar csd');
  const img = _dts.ctImg(data.avatar);
  avatar.appendChild(img);
  const outBox = _dts.ctBox('circle csd');
  let inBox = outBox;
  for (let i = 0; i < count; i++) {
    let temp = _dts.ctBox('circle csd');
    inBox.appendChild(temp);
    inBox = temp;
  }
  inBox.appendChild(avatar);
  avatarBox.appendChild(outBox);
  inner.appendChild(avatarBox);
  // 山峰
  const mts = _dts.ctBox('mountains');
  mts.appendChild(createMountain(data.desc));
  mts.appendChild(createMountain(data.site));
  mts.appendChild(createMountain(data.label));
  inner.appendChild(mts);
  card.appendChild(inner);
  return card;
};

// 创建友链块
const bindLinks = () => {
  const links = _dts.getElById('skFLinks');
  if (!links) return;
  links.classList.add('sk-flinks');
  // 先隐藏
  links.style.display = 'none';
  const data = parseLinks('skFLinks');
  if (!data.length) return;
  const tit = parseLinksTitle('skFLinks');
  const title = _dts.ctTitle(tit, 2);
  const list = _dts.ctBox('sk-flink-list');
  for (let i = 0; i < data.length; i++) {
    const item = createLinkCard(data[i]);
    list.appendChild(item);
  }
  links.textContent = '';
  links.appendChild(title);
  links.appendChild(list);
  links.style.display = 'flex';
};

// 创建友链格式
const buildLinksFormat = () => {
  const fm = _dts.getElById('skLinkFormat');
  if (!fm) return;
  fm.classList.add('sk-flink-format');
  fm.style.display = 'none';
  // const tit = parseLinksTitle('skLinkFormat') ?? '申请方式';
  // const p = _dts.getElByTag('p', fm);
  // const code = _dts.getElByTag('pre', fm);
  // const title = _dts.ctTitle(tit, 2);

  // fm.textContent = '';
  // fm.appendChild(title);
  // code.length > 0 && fm.appendChild(code[0]);
  fm.style.display = 'flex';
};

const parseLang = (dom: HTMLElement) => {
  const code = _dts.getElByTag('code', dom);
  let lang = 'text';
  if (code.length) {
    const exec = /language-([^\s]+)/.exec(code[0].className);
    exec && (lang = exec[1]);
  }
  return lang;
};

const createSelfTab = (lang: string) => {
  const tab = _dts.ctBox('tab');
  tab.setAttribute('data-lang', lang);
  const span = _dts.ctSpan(lang);
  tab.appendChild(span);
  return tab;
};

// 我的友链
const buildSelfLink = () => {
  const slink = _dts.getElById('skSelfLink');
  if (!slink) return;
  slink.classList.add('sk-flink-self');
  slink.style.display = 'none';
  // 获取code
  const tabBox = _dts.ctBox('tabs');
  const tabs = _dts.ctBox('tab-list');
  tabBox.appendChild(tabs);
  const codeList = _dts.ctBox('codes');
  const list = _dts.ctBox('code-list');
  codeList.appendChild(list);
  const codes = _dts.getElByTag('pre', slink);
  for (let i = codes.length - 1; i >= 0; i--) {
    const lang = parseLang(codes[i]);
    const tab = createSelfTab(lang);
    tab.addEventListener('click', function () {
      const childs = tabs.children;
      for (let t = 0; t < childs.length; t++) {
        childs[t].classList.remove('active');
      }
      this.classList.add('active');
      const currentLang = this.dataset['lang'];
      if (currentLang) {
        const currentCode = _dts.getElById(`lang-${currentLang}`);
        currentCode && (list.style.transform = `translateX(-${currentCode.offsetLeft}px)`);
      }
    });
    tabs.insertBefore(tab, tabs.firstChild);
    const code = _dts.ctBox('code-item', `lang-${lang}`);
    code.appendChild(codes[i]);
    list.insertBefore(code, list.firstChild);
  }
  tabs.children[0].classList.add('active');
  // slink.textContent = '';
  slink.appendChild(tabBox);
  slink.appendChild(codeList);
  slink.style.display = 'flex';
};

// 更新header信息
const refreshHeader = (data: ArticleInfo) => {
  if (data.cover) {
    setCover(data.cover);
  }
  setBrand({
    title: data.title,
    desc: data.desc,
    info: [
      { icon: 'ib-view', text: data.view, cls: 'post_view_count' },
      { icon: 'ib-comment', text: data.comment, cls: 'post_comment_count' },
      { icon: 'ib-digg', text: data.digg, cls: 'post_digg_count' }
    ]
  });
};

const getRandomFLinks = () => {
  const plinks = parseLinks('skPFLinks');
  const links = parseLinks('skFLinks');
  const list: FLinkItem[] = [...plinks, ...links];
  // 随机顺序
  list.sort(function (a, b) {
    return Math.random() - 0.5;
  });
  return list;
};

const createCastBtn = (text: string) => {
  const btn = _dts.ctBox('tool-btn');
  const span = _dts.ctSpan(text);
  btn.appendChild(span);
  return btn;
};

const createCastItem = (data: FLinkItem) => {
  const item = _dts.ctBox('cast-item');
  item.setAttribute('title', data.site);
  const link = _dts.ctLink(data.url);
  link.setAttribute('target', '_blank');
  const cover = _dts.ctImg(data.avatar, 'avatar');
  link.appendChild(cover);
  item.appendChild(link);
  return item;
};

interface Wrap {
  current: HTMLElement;
  childs: FLinkItem[];
}

// 构建友链弹幕
const buildLinksCast = (rows: number = 2) => {
  const cast = _dts.getElById('skLinksCast');
  if (!cast) return;
  cast.classList.add('sk-flink-cast');
  const tit = parseLinksTitle('skLinksCast') || '友链弹幕';
  const p = parseLinksP('skLinksCast');
  cast.style.display = 'none';
  cast.textContent = '';
  // 创建操作块
  const topBox = _dts.ctBox('top-box');
  const titleBox = _dts.ctBox('title-box');
  // title
  titleBox.appendChild(_dts.ctSpan(tit, 'title'));
  titleBox.appendChild(_dts.ctSpan(p, 'desc'));
  const toolsBox = _dts.ctBox('tool-box');
  // 按钮
  const randomBtn = createCastBtn('随机访问');
  const reqBtn = createCastBtn('申请友链');
  toolsBox.appendChild(randomBtn);
  toolsBox.appendChild(reqBtn);

  topBox.appendChild(titleBox);
  topBox.appendChild(toolsBox);
  // 底部弹幕块
  const castBox = _dts.ctBox('cast-box');
  const castWrapper = _dts.ctBox('cast-wrapper');
  const wraps: Wrap[] = [];
  for (let i = 0; i < rows; i++) {
    const wrapRow = _dts.ctBox('cast-wrap-row');
    wraps.push({
      current: wrapRow,
      childs: []
    });
    castWrapper.appendChild(wrapRow);
  }

  const links = getRandomFLinks();

  let currentRow = 0;
  for (let i = 0; i < links.length; i++) {
    const castItem = createCastItem(links[i]);
    wraps[currentRow].current.appendChild(castItem);
    wraps[currentRow].childs.push(links[i]);
    currentRow = (currentRow + 1) % rows;
  }

  // 复制wraps
  for (let i = 0; i < wraps.length; i++) {
    const current = wraps[i].current;
    const childs = wraps[i].childs;
    for (let j = 0; j < childs.length; j++) {
      const castItem = createCastItem(childs[j]);
      current.appendChild(castItem);
    }
  }

  randomBtn.onclick = function () {
    const len = links.length;
    const index = Math.floor(Math.random() * len);
    window.open(links[index].url, '_blank');
  };

  reqBtn.onclick = function () {
    const target = _dts.getElById('skLinkFormat');
    target && target.scrollIntoView();
  };

  castBox.appendChild(castWrapper);

  cast.appendChild(topBox);
  cast.appendChild(castBox);
  cast.style.display = 'flex';
};

/**
 * 创建
 */
const buildFLinks = () => {
  const posts = _dts.getElByCls<'div'>('post');
  if (!posts.length) return;
  const post = posts[0];

  const info = getArticleInfo();

  refreshHeader(info);

  // 友链弹幕
  // ipad
  buildLinksCast();

  // 推荐博客
  buildPLinks();

  // 小伙伴们
  bindLinks();

  // 友链格式
  buildLinksFormat();

  // 站长友链
  buildSelfLink();

  const bottomMess = createBottomMess(0b0110, info);
  post.appendChild(bottomMess);

  // 评论
  const manager = new CommentManager();
  window.commentManager = manager;
  manager.initComments();

  // 修改提示
  const commentText = _dts.getElById('tbCommentBody');
  commentText && commentText.setAttribute('placeholder', '如想添加友链请按申请方法留言');

  // 更新文章状态
  updatePostStats();
};

export default buildFLinks;
