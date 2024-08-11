import {
  homeLink,
  cateLink,
  rankLink,
  tagLink,
  friendLink,
  isHomePage,
  isCatesPage,
  isRankPage,
  isTagsPage,
  isFLinksPage,
  cnblogLink,
  newPost,
  oldPost,
  send,
  rss,
  admin,
  isOwner
} from '@/utils/cnblogUtil';

export interface NavItem {
  name: NavType;
  icon: string;
  text: string;
  url: string;
  checked: boolean;
}

export interface ToolItem {
  name: string;
  icon: string;
  url: string;
  color?: string;
  isShow?: boolean;
}

/**
 * 导航类型：首页 | 分类 | 排行榜 | 标签 | 友链
 */
export type NavType = 'home' | 'cate' | 'rank' | 'tag' | 'flink';

interface NavDOMs {
  home: HTMLElement[];
  cate: HTMLElement[];
  rank: HTMLElement[];
  tag: HTMLElement[];
  flink: HTMLElement[];
  lastNav: NavType;
}

/** 导航列表 */
const navList = {
  home: {
    name: 'home',
    icon: 'ib-home-iv',
    text: '首页',
    url: homeLink,
    checked: isHomePage()
  },
  cate: {
    name: 'cate',
    icon: 'ib-cate-iv',
    text: '分类',
    url: cateLink,
    checked: isCatesPage()
  },
  rank: {
    name: 'rank',
    icon: 'ib-rank-iv',
    text: '排行榜',
    url: rankLink,
    checked: isRankPage()
  },
  tag: {
    name: 'tag',
    icon: 'ib-tag-iv',
    text: '标签',
    url: tagLink,
    checked: isTagsPage(true)
  },
  flink: {
    name: 'flink',
    icon: 'ib-flink-iv',
    text: '友链',
    url: friendLink,
    checked: isFLinksPage()
  }
};

/** 工具列表 */
const toolList: ToolItem[] = [
  {
    name: '博客园',
    icon: 'ib-cnblog-f',
    url: cnblogLink,
    color: '#4990D8'
  },
  {
    name: '新随笔',
    icon: 'ib-edit',
    url: newPost,
    color: '#BBA1CB',
    isShow: isOwner()
  },
  {
    name: '草稿箱',
    icon: 'ib-draft',
    url: oldPost,
    color: '#7F9FAF',
    isShow: isOwner()
  },
  {
    name: '联系',
    icon: 'ib-contact',
    url: send,
    color: '#D6C560'
  },
  {
    name: '订阅',
    icon: 'ib-sub-1',
    url: rss,
    color: '#E5A84B'
  },
  {
    name: '管理',
    icon: 'ib-setting',
    url: admin,
    color: '#A8B78C'
  }
];

const checkedClass = 'checked';

/**
 * 获取导航列表
 * @returns
 */
export const getNavList: () => NavItem[] = () => {
  return JSON.parse(JSON.stringify(Object.values(navList)));
};

/** 获取工具表 */
export const getToolList = () => {
  return toolList;
};

const navDOMs: NavDOMs = {
  home: [],
  cate: [],
  rank: [],
  tag: [],
  flink: [],
  lastNav: 'home'
};

/** 绑定对应导航DOM */
export const bindDOM = (type: NavType, dom: HTMLElement) => {
  navDOMs[type].push(dom);
};

/** 选中对应导航 */
export const checkNav = (type: NavType) => {
  // 取消选中
  navList[navDOMs.lastNav].checked = false;
  // if (navDOMs[navDOMs.lastNav].length > 0) {
  //   for (const dom of navDOMs[navDOMs.lastNav]) {
  //     dom.classList.remove(checkedClass);
  //   }
  // }
  // 选中
  navDOMs.lastNav = type;
  // navList[type].checked = true;
  // if (navDOMs[type].length > 0) {
  //   for (const dom of navDOMs[type]) {
  //     dom.classList.add(checkedClass);
  //   }
  // }
  location.href = navList[type].url;
};
