interface SocialItem {
  icon?: string;
  text: string;
  url?: string;
  /** CSS合法颜色值 */
  color?: string;
}

interface Social {
  [key?: string]: string | any;
}

type StatsType = 'post' | 'article' | 'comment' | 'read';

interface ProfileMsg {
  name: string;
  count: string;
  url?: string;
  stats?: StatsType;
}

interface Profile {
  /** 名称 */
  name: string;
  /** 签名 */
  sign: string;
  msgs: ProfileMsg[];
}

type ExeractType = 'random' | 'daily' | 'count';

interface MostTicket {
  type: ExeractType | 'fixed';
  prebg?: string;
  sufbg?: string;
  count?: number;
}

/** 主题配置表 */

interface ThemeMap {
  [key: string]: string;
}

interface Theme {
  name: ThemeName;
}

interface SkixivTheme extends Theme {
  /**
   * 底部信息块
   * 0b11000
   * 最新随笔 | 最新评论 | 阅读排行 | 推荐排行 | 评论排行
   */
  btmess?: number;
  mticket?: MostTicket;
  defaultCover?: string;
  defaultSign?: string;
}

interface ThemeConfig {
  /** 主题名 */
  theme?: string | SkixivTheme;
  /** 博客昵称 */
  name?: string;
  /** 博客名 */
  blogName?: string;
  /** 个性签名 */
  sign?: string;
  /** 头像 */
  avatar?: string;
  /** loading最短时长 */
  duration?: number;
  /** 社交信息 */
  social?: Social;
  /** logo */
  logo?: string;
}

/** 博客状态 */
interface BlogStats {
  /** 随笔 */
  post: string;
  /** 文章 */
  article: string;
  /** 评论 */
  comment: string;
  /** 阅读 */
  read: string;
}

/**
 * 博客园用户信息
 */
interface CBUserInfo {
  spaceUserId: number;
  displayName: string;
  blogApp: string;
  homeLink: string;
  blogLink: string;
  iconName: string;
  avatarName: string;
  registerTime: string;
  unreadMsg: number;
  // isVip: boolean;
  // vipId: number;
  // vipIc: string;
  // vipPeriod: string;
  // wealth: number;
}

interface CnBlogAccount {
  getBlockList: Function;
  getUserInfo: Function;
  login: Function;
  logout: Function;
  register: Function;
}

interface CategoryEntry {
  categoryId: number;
  categoryType: number;
}

declare interface Window {
  loadingTheme: Function;
  themeConfig: ThemeConfig;
  isBlogOwner: boolean;
  isLogined: boolean;
  currentBlogApp: string;
  userInfo?: CBUserInfo;
  categoryEntry?: CategoryEntry;
  cb_blogUserGuid: string;
  /** post id */
  cb_entryId: number;
  /** post date */
  cb_entryCreatedDate: string;
  cb_postTitle: string;
  cb_postType: number;
  /** 博客 id */
  cb_blogId: number;
  cb_blogApp: string;
  loadLink: Function;
  loadScript: Function;
  account: CnBlogAccount;
  c_has_follwed: boolean;
  followByGroup: Function;
  getAjaxBaseUrl: Function;
  commentManager: any;
  highlighter: any;
  darkModeCodeHighlightTheme: string;
  codeHighlightTheme: string;
}
/** 当前博客ID */
declare var currentBlogId: number;
/** 是否允许评论 */
declare var allowComments: boolean;

/** 评论管理器 */
declare var commentManager;
/** 评论编辑器 */
declare const commentEditor;
/** 代码高亮 */
declare const markdown_highlight: Function;
/** 数学公式解析 */
declare const cb_mathjax_render: Function;
/** 代码块工具加成 */
declare const initCodeBlockToolbar: Function;
/** 图片 */
declare const zoomManager;

/** 收藏 */
declare const AddToWz: Function;

interface TreeCategoryPopuOptions {
  trigger: {
    element: HTMLElement | null;
    eventName: string;
  };
  defaultExpandKeys: number[];
  categoryType: number;
}

interface TreeCategoryPopuClass {
  new (options: TreeCategoryPopuOptions): TreeCategoryPopuClass;
}
declare var TreeCategoryPopup: TreeCategoryPopuClass;
